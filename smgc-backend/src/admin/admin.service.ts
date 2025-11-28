// src/admin/admin.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    async getAllOrders() {
        return prisma.order.findMany({
            include: {
                items: true,
                user: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateOrderStatus(orderId: number, status: string) {
        if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
            throw new BadRequestException(`Invalid order status: ${status}`);
        }

        return prisma.order.update({
            where: { id: orderId },
            data: {
                status: { set: status as OrderStatus },
            },
        });
    }

    async createProduct(data: any) {
        return prisma.product.create({ data });
    }

    async updateProduct(id: number, data: any) {
        return prisma.product.update({
            where: { id },
            data,
        });
    }

    async deleteProduct(id: number) {
        return prisma.product.delete({
            where: { id },
        });
    }
}
