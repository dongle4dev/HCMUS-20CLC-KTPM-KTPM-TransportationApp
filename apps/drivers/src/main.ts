import { NestFactory } from '@nestjs/core';
import { DriversModule } from './drivers.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from 'y/common/rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(DriversModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('DEMAND'));
  await app.startAllMicroservices();
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('DRIVER_HOST_PORT'));
}
bootstrap();
