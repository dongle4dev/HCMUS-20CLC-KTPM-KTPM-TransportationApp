import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqService } from 'y/common';
import { HotlinesModule } from './hotlines.module';

async function bootstrap() {
  const app = await NestFactory.create(HotlinesModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('HOTLINE'));
  await app.startAllMicroservices();
}
bootstrap();
