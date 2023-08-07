import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('ADMIN_HOST_PORT'));
}
bootstrap();
