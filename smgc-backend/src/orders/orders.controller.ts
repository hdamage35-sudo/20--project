// src/orders/orders.controller.ts
import {Controller,Get,Post,Param,Body,ParseIntPipe,UseGuards,Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order.dto.js';
import { JwtGuard } from '../auth/jwt.guards.js';
import { CurrentUser } from '../auth/current-user-decorator.js';
import type { Order, OrderItem } from '@prisma/client';
import type { AuthUserPayload } from '../types/auth-user-payload.type.js';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    create(
        @CurrentUser() user: AuthUserPayload,
        @Body() dto: CreateOrderDto,
    ): Promise<Order & { items: OrderItem[] }> {
        return this.ordersService.create(user.sub, dto);
    }

    @Get()
    findAll(
        @CurrentUser() user: AuthUserPayload,
    ): Promise<(Order & { items: OrderItem[] })[]> {
        return this.ordersService.findAllForUser(user.sub);
    }

    @Get(':id')
    findOne(
        @CurrentUser() user: AuthUserPayload,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Order & { items: OrderItem[] }> {
        return this.ordersService.findOneForUser(user.sub, id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateOrderStatusDto,
    ): Promise<Order> {
        return this.ordersService.updateStatus(id, dto);
    }
}
