import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('mercadopago')
    createPreference(@Body() body: { orderId: number }) {
        return this.paymentsService.createMercadoPagoPreference(body.orderId);
    }

    @Post('mercadopago/webhook')
    handleWebhook(@Body() body: any) {
        return this.paymentsService.processWebhook(body);
    }
}
    