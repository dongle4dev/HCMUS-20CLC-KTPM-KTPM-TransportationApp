import { NestFactory } from '@nestjs/core';
import { BankaccountsModule } from './bankaccounts.module';

async function bootstrap() {
  const app = await NestFactory.create(BankaccountsModule);
  await app.listen(3000);
}
bootstrap();
