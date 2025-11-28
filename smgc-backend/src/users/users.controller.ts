import {Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtGuard } from '../auth/jwt.guards.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(AdminGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateUserDto,
    ) {
        return this.usersService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }
}
