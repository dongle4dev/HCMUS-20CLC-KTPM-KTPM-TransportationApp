import { NestFactory } from '@nestjs/core';
import { TrackingModule } from './tracking.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TrackingModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
