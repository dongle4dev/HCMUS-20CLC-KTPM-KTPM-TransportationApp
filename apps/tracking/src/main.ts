import { NestFactory } from '@nestjs/core';
import { TrackingModule } from './tracking.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TrackingModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
