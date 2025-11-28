// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { ProductsModule } from '../products/products.module.js';
import { LogModule } from '../log/log.module.js';

@Module({
    imports: [
        ProductsModule,
        LogModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
