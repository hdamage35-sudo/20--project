import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { CreateUserDto } from './dto/create.user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    async create(data: CreateUserDto) {
        return prisma.user.create({ data });
    }

    async findAll() {
        return prisma.user.findMany();
    }

    async findOne(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: number, data: UpdateUserDto) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return prisma.user.delete({
            where: { id },
        });
    }
}
