import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqService } from 'y/common';
import { ReportsModule } from './reports.module';

async function bootstrap() {
  const app = await NestFactory.create(ReportsModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('REPORT_HOST_PORT'));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('REPORT'));
  await app.startAllMicroservices();
}
bootstrap();
