import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ChatboxesModule } from './chatboxes.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatboxesModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('CHATBOX_HOST_PORT'));
}
bootstrap();
