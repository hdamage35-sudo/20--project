import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { LogModule } from '../log/log.module.js';

@Module({
    imports: [LogModule],   
    providers: [PaymentsService],
    controllers: [PaymentsController],
})
export class PaymentsModule {}
