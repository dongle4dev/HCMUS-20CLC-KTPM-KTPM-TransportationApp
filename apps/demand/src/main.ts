import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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

  // const microserviceOptions: MicroserviceOptions = {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://guest:guest@localhost:5672'], // RabbitMQ server URI
  //     queue: 'exchange_name', // Replace with your exchange name
  //     queueOptions: { durable: false },
  //   },
  // };

  // // Connect the microservice to the application
  // app.connectMicroservice(microserviceOptions);

  // // Start the microservice and the main application
  // await app.startAllMicroservices();

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('DEMAND_HOST_PORT'));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('DEMAND'));
  await app.startAllMicroservices();
}
bootstrap();
