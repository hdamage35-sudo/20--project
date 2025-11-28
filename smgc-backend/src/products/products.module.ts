// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { LogModule } from '../log/log.module.js';

@Module({
    imports: [LogModule],
    providers: [ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService],
})
export class ProductsModule {}
