import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use('/uploads', express.static(join(process.cwd(), 'be', 'uploads')));

  const portRaw = process.env.PORT;
  const port = Number(portRaw);
  if (!portRaw || !Number.isFinite(port)) {
    throw new Error('Missing or invalid PORT in .env');
  }
  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Lỗi khởi động ứng dụng:', err);
  process.exit(1);
});
