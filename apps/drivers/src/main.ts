import { NestFactory } from '@nestjs/core';
import { DriversModule } from './drivers.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from 'y/common/rmq/rmq.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(DriversModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice(rmqService.getOptions('DEMAND'));
  // await app.startAllMicroservices();
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://username:password@localhost:5672'], // RabbitMQ server URI
      queue: 'demand_queue', // Replace with your exchange name
      queueOptions: { durable: false },
    },
  };

  // Connect the microservice to the application
  app.connectMicroservice(microserviceOptions);

  // Start the microservice and the main application
  await app.startAllMicroservices();
  const configService = app.get(ConfigService);
  console.log(configService.get<number>('DRIVER_HOST_PORT'));
  await app.listen(configService.get<number>('DRIVER_HOST_PORT'));
}
bootstrap();
