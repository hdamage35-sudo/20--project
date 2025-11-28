import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    await app.listen(process.env.PORT || 3000);
    console.log(`App running on http://localhost:${process.env.PORT || 3000}`);
    console.log("DB URL:", process.env.DATABASE_URL);
}

bootstrap();
