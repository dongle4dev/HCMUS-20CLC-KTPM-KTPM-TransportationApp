import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LocationsModule } from './locations.module';
import { RmqService } from 'y/common';

async function bootstrap() {
  const app = await NestFactory.create(LocationsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('LOCATION'));
  await app.startAllMicroservices();
}
bootstrap();
