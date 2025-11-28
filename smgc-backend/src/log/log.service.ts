import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class LogService {
    async createLog(
        type: string,
        message: string,
        userId?: number,
        metadata?: any,
    ) {
        return prisma.log.create({
            data: {
                type,
                message,
                userId,
                metadata,
            },
        });
    }
}
