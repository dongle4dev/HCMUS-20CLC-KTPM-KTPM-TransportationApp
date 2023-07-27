import { ValidationPipe } from '@nestjs/common';
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
  await app.listen(3006);
}
bootstrap();
