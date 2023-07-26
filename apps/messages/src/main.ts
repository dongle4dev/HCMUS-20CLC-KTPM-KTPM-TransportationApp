import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MessagesModule } from './messages.module';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3003);
}
bootstrap();
