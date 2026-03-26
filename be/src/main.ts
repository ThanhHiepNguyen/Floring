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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Guest-Id'],
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

  const port = process.env.PORT || 8000;

  console.log(` Server đang khởi chạy trên cổng: ${port}`);


  await app.listen(port, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error(' Lỗi khởi động:', err);

});
