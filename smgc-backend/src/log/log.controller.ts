import { Controller, Get } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { LogService } from './log.service.js';

@Controller('logs')
export class LogController {
    constructor(private readonly logService: LogService) {}

    @Get()
    findAll() {
        return prisma.log.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
}
