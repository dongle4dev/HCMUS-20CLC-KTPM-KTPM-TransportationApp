import { NestFactory } from '@nestjs/core';
import { CallsModule } from './calls.module';

async function bootstrap() {
  const app = await NestFactory.create(CallsModule);
  await app.listen(3000);
}
bootstrap();
