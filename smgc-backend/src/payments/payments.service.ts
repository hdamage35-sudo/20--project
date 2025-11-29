import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { LogService } from '../log/log.service.js';

@Injectable()
export class PaymentsService {
    private client: MercadoPagoConfig;
    private preference: Preference;

    constructor(private readonly logService: LogService) {
        this.client = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN!, // TEST token
        });

        this.preference = new Preference(this.client);
    }

    // Crear preferencia (checkout de MercadoPago)
    async createMercadoPagoPreference(orderId: number) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) throw new BadRequestException('Order not found');

        // Items requeridos por la nueva SDK
        const items = order.items.map((item) => ({
            id: String(item.productId), // obligatorio
            title: `Product ${item.productId}`,
            quantity: item.quantity,
            unit_price: item.price.toNumber(),
            currency_id: 'COP',
        }));

        const response = await this.preference.create({
            body: {
                items,
                metadata: { orderId: order.id },
                back_urls: {
                success: "https://google.com",
                failure: "https://google.com",
                pending: "https://google.com"
            },
                auto_return: 'approved',

                notification_url: 'https://render.com/docs/web-services#port-binding/link.mercadopago.com.co/smgc'
            }
        });

        await this.logService.createLog(
            'PAYMENT_PREF_CREATED',
            `MP Preference created for order ${order.id}`,
            undefined,
            response
        );

        return {
            init_point: response.init_point,
            sandbox_init_point: response.sandbox_init_point,
        };
    }

    // Webhook de MercadoPago (cuando el pago se aprueba)
    async processWebhook(body: any) {
        try {
            const data = body.data || body;

            const orderId = data?.metadata?.orderId;
            const status = data?.status;

            if (!orderId) return;

            if (status === 'approved') {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'PAID' },
                });

                await this.logService.createLog(
                    'MP_PAYMENT_APPROVED',
                    `Order ${orderId} marked as PAID by MP webhook`,
                    undefined,
                    data
                );
            }

            return { received: true };
        } catch (error) {
            console.error("Webhook error:", error);
            return { received: false };
        }
    }
}
