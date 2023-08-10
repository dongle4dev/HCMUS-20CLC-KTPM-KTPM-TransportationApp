import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SupplyModule } from './supply.module';

async function bootstrap() {
  const app = await NestFactory.create(SupplyModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('SUPPLY_HOST_PORT'));
}
bootstrap();
