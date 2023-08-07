import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HotlinesModule } from './hotlines.module';

async function bootstrap() {
  const app = await NestFactory.create(HotlinesModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3007);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('HOTLINE_HOST_PORT'));
}
bootstrap();
