import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AdminsModule } from './admins.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminsModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3002);
}
bootstrap();
