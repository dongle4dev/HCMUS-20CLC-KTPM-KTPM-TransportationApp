import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { RmqService } from 'y/common';
import { CustomersModule } from './customers.module';
import { HttpModule } from '@nestjs/axios';
async function bootstrap() {
  const app = await NestFactory.create(CustomersModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('CUSTOMER_HOST_PORT'));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('CUSTOMER'));
  await app.startAllMicroservices();
}
bootstrap();
