import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { ProductsModule } from '../products/products.module.js';
import { OrdersModule } from '../orders/orders.module.js';

@Module({
    imports: [ProductsModule, OrdersModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
