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
import { AdminGuard } from '../auth/admin.guard.js';
import type { Product } from '@prisma/client';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    
    @UseGuards(JwtGuard)
    @Get()
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }


    @UseGuards(JwtGuard)
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Post()
    create(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productsService.create(dto);
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto,
    ): Promise<Product> {
        return this.productsService.update(id, dto);
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        return this.productsService.remove(id);
    }
}
