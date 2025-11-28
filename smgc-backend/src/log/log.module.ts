import { Module } from '@nestjs/common';
import { LogService } from './log.service.js';
import { LogController } from './log.controller.js';

@Module({
    providers: [LogService],
    controllers: [LogController],
    exports: [LogService],
})
export class LogModule {}
