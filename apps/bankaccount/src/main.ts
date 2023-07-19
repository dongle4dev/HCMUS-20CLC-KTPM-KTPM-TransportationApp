import { NestFactory } from '@nestjs/core';
import { BankaccountModule } from './bankaccount.module';

async function bootstrap() {
  const app = await NestFactory.create(BankaccountModule);
  await app.listen(3000);
}
bootstrap();
