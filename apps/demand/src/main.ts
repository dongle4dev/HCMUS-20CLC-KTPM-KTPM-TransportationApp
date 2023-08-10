import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqService } from 'y/common/rmq/rmq.service';
import { DemandModule } from './demand.module';

async function bootstrap() {
  const app = await NestFactory.create(DemandModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('DEMAND_HOST_PORT'));
}
bootstrap();
