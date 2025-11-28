import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import type { Product } from '@prisma/client';
import type { CreateProductDto } from './dto/create-product.dto.js';
import type { UpdateProductDto } from './dto/update-product.dto.js';
import { LogService } from '../log/log.service.js';

@Injectable()
export class ProductsService {
    constructor(private readonly logService: LogService) {}

    async create(data: CreateProductDto): Promise<Product> {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                imageUrl: data.imageUrl,
            },
        });

        await this.logService.createLog(
            'PRODUCT_CREATED',
            `Product ${product.id} created`,
            undefined,
            data
        );

        return product;
    }

    async findAll(): Promise<Product[]> {
        return prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: number, data: UpdateProductDto): Promise<Product> {
        await this.findOne(id);

        const updated = await prisma.product.update({
            where: { id },
            data,
        });

        await this.logService.createLog(
            'PRODUCT_UPDATED',
            `Product ${id} updated`,
            undefined,
            data
        );

        return updated;
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);

        await prisma.product.delete({
            where: { id },
        });

        await this.logService.createLog(
            'PRODUCT_DELETED',
            `Product ${id} deleted`
        );
    }

    async validateStock(productId: number, quantity: number): Promise<void> {
        const product = await this.findOne(productId);

        if (product.stock < quantity) {
            throw new BadRequestException(
                `Not enough stock for product ${productId}. Available: ${product.stock}, requested: ${quantity}`,
            );
        }
    }

    async decreaseStock(productId: number, quantity: number): Promise<Product> {
        await this.validateStock(productId, quantity);

        const updated = await prisma.product.update({
            where: { id: productId },
            data: {
                stock: {
                    decrement: quantity,
                },
            },
        });

        await this.logService.createLog(
            'STOCK_UPDATED',
            `Stock decreased for product ${productId}`,
            undefined,
            { quantity }
        );

        return updated;
    }
}
