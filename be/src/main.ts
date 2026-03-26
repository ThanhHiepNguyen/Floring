import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server / curl / health checks (no Origin header)
      if (!origin) return callback(null, true);

      const allowList = [
        /^https:\/\/.*\.vercel\.app$/i,
        /^https:\/\/floring\.vercel\.app$/i,
        /^http:\/\/localhost:\d+$/i,
      ];

      const ok = allowList.some((rule) => rule.test(origin));
      return callback(ok ? null : new Error(`CORS blocked for origin: ${origin}`), ok);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Guest-Id', 'x-guest-id'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Serve uploaded files.
  // Note: WORKDIR trong Docker backend là /app (root của project `be`), nên uploads nằm ở /app/uploads.
  // Tránh join thêm 'be' vì sẽ thành /app/be/uploads (không tồn tại) => 404.
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Compatibility: some older DB records may still store image paths like "/uploads/<uuid>.png"
  // while the current upload flow saves to Cloudinary.
  // If the local file doesn't exist, redirect to the corresponding Cloudinary URL.
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  if (cloudName) {
    app.get('/uploads/*', (req, res) => {
      const filePath = (req.params as any)[0] as string | undefined;
      if (!filePath) return res.sendStatus(404);

      const encoded = filePath
        .split('/')
        .map((seg) => encodeURIComponent(seg))
        .join('/');

      const cloudUrl = `https://res.cloudinary.com/${cloudName}/image/upload/floring/uploads/${encoded}`;
      return res.redirect(302, cloudUrl);
    });
  }

  const port = process.env.PORT || 8000;

  console.log(`🚀 Server đang khởi chạy trên cổng: ${port}`);
  await app.listen(port, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error('❌ Lỗi khởi động:', err);
  // Không dùng process.exit(1) để Railway có thể thử restart lại
});
