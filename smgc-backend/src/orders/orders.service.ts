// src/orders/orders.service.ts
import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import type { Order, OrderItem, Product } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import type { UpdateOrderStatusDto } from './dto/update-order.dto.js';
import { ProductsService } from '../products/products.service.js';
import { LogService } from '../log/log.service.js';

type OrderWithItems = Order & { items: OrderItem[] };

type OrderItemCreateInput = {
    productId: number;
    quantity: number;
    price: Prisma.Decimal;
};

@Injectable()
export class OrdersService {
    constructor(private readonly productsService: ProductsService, private readonly logService: LogService,) {}

    async create(userId: number, dto: CreateOrderDto): Promise<OrderWithItems> {
        const productIds: number[] = dto.items.map((item) => item.productId);

        const products: Product[] = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException('Some products do not exist');
        }

        const productsById = new Map<number, Product>(
            products.map((p) => [p.id, p]),
        );
        

        for (const item of dto.items) {
            const product = productsById.get(item.productId);
            if (!product) {
                throw new BadRequestException(
                    `Product ${item.productId} not found`,
                );
            }
            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Not enough stock for product ${product.id}. Available: ${product.stock}, requested: ${item.quantity}`,
                );
            }
        }

        for (const item of dto.items) {
            await this.productsService.decreaseStock(
                item.productId,
                item.quantity,
            );
        }

        const itemsData: OrderItemCreateInput[] = dto.items.map((item) => {
            const product = productsById.get(item.productId)!;

            return {
                productId: product.id,
                quantity: item.quantity,
                price: new Prisma.Decimal(product.price),
            };
        });

        const totalNumber: number = itemsData.reduce(
            (acc, item) => acc + item.price.toNumber() * item.quantity,
            0,
        );

        const order: OrderWithItems = await prisma.order.create({
            data: {
                userId,
                total: new Prisma.Decimal(totalNumber),
                items: {
                    create: itemsData,
                },
            },
            include: {
                items: true,
            },
        });

        await this.logService.createLog(
        'ORDER_CREATED',
        `Order ${order.id} created`,
        userId,
        {
            items: itemsData,
            total: totalNumber,
        },
        );


        return order;
    }

    async findAllForUser(
        userId: number,
    ): Promise<OrderWithItems[]> {
        return prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOneForUser(
        userId: number,
        orderId: number,
    ): Promise<OrderWithItems> {
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(orderId: number, dto: UpdateOrderStatusDto): Promise<Order> {
    const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status: dto.status },
    });

    await this.logService.createLog(
        'ORDER_STATUS_UPDATED',
        `Order ${orderId} updated to ${dto.status}`,
        undefined,
        { status: dto.status }
    );

    return updated;
}
}