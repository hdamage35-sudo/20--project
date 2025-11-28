import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { AdminModule } from './admin/admin.module.js';
import { LogModule } from './log/log.module.js';


@Module({
  imports: [UsersModule, AuthModule, ProductsModule, OrdersModule, PaymentsModule, AdminModule, LogModule],
})
export class AppModule {}
