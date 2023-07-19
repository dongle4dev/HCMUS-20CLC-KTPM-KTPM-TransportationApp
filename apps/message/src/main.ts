import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MessageModule } from './message.module';

async function bootstrap() {
  const app = await NestFactory.create(MessageModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3003);
}
bootstrap();
