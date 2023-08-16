import { NestFactory } from '@nestjs/core';
import { TripModule } from './trip.module';
import { RmqService } from 'y/common';

async function bootstrap() {
  const app = await NestFactory.create(TripModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('TRIP'));
  await app.startAllMicroservices();
}

bootstrap();
