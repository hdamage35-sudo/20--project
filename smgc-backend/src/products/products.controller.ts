// src/products/products.controller.ts
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { JwtGuard } from '../auth/jwt.guards.js';
import type { Product } from '@prisma/client';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('products')
@UseGuards(JwtGuard, AdminGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    create(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productsService.create(dto);
    }

    @Get()
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto,
    ): Promise<Product> {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        return this.productsService.remove(id);
    }
}
