import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqService } from 'y/common';
import { VehiclesModule } from './vehicles.module';

async function bootstrap() {
  const app = await NestFactory.create(VehiclesModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('VEHICLE_HOST_PORT'));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('VEHICLE'));
  await app.startAllMicroservices();
}
bootstrap();
