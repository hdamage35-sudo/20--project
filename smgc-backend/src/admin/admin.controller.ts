import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtGuard } from '../auth/jwt.guards.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('admin')
@UseGuards(JwtGuard, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // Órdenes
    @Get('orders')
    getAllOrders() {
        return this.adminService.getAllOrders();
    }

    @Patch('orders/:id/status')
    updateOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
    ) {
        return this.adminService.updateOrderStatus(id, status);
    }

    // Productos
    @Post('products')
    createProduct(@Body() data: any) {
        return this.adminService.createProduct(data);
    }

    @Patch('products/:id')
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
    ) {
        return this.adminService.updateProduct(id, data);
    }

    @Delete('products/:id')
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deleteProduct(id);
    }
}
