import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DiscoveryModule } from './discovery.module';

async function bootstrap() {
  const app = await NestFactory.create(DiscoveryModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('DISCOVERY_HOST_PORT'));
}
bootstrap();
