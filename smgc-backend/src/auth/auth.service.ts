import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LogService } from '../log/log.service.js';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private readonly logService: LogService) {}

    async register(data) {
        const exists = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (exists) {
            throw new BadRequestException('Email already registered');
        }

        const hashed = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashed
            }
        });

        await this.logService.createLog(
            'USER_REGISTERED',
            `User ${user.id} registered`,
            user.id,
            { email: user.email }
        );

        return this.signToken(user);
    }

    async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await bcrypt.compare(data.password, user.password);

        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.logService.createLog(
            'USER_LOGIN',
            `User ${user.id} logged in`,
            user.id
        );

        return this.signToken(user);
    }
    
    signToken(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role
    };

    const token = this.jwt.sign(payload);

    return {
        access_token: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    };
}
}
