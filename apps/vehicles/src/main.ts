import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { VehiclesModule } from './vehicles.module';

async function bootstrap() {
  const app = await NestFactory.create(VehiclesModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3005);
}
bootstrap();
