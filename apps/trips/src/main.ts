import { NestFactory } from '@nestjs/core';
import { TripModule } from './trip.module';
import { RmqService } from 'y/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TripModule);
  const rmqService = app.get<RmqService>(RmqService);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
  app.connectMicroservice(rmqService.getOptions('TRIP'));
  await app.startAllMicroservices();
}

bootstrap();
