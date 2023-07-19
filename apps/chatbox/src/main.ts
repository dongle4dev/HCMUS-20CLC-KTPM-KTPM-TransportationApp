import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ChatboxModule } from './chatbox.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatboxModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3004);
}
bootstrap();
