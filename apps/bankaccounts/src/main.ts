import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { BankaccountsModule } from './bankaccounts.module';

async function bootstrap() {
  const app = await NestFactory.create(BankaccountsModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('BANKACCOUNT_HOST_PORT'));
}
bootstrap();
