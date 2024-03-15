import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { isDevelopment } from './utility/env.utility';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const allowedOrigin = isDevelopment()
    ? 'http://localhost:5173'
    : process.env.CLIENT_URL;
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: allowedOrigin,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
