import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { VehicleModule } from './vehicle.module';

async function bootstrap() {
  const app = await NestFactory.create(VehicleModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3005);
}
bootstrap();
