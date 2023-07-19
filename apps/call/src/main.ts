import { NestFactory } from '@nestjs/core';
import { CallModule } from './call.module';

async function bootstrap() {
  const app = await NestFactory.create(CallModule);
  await app.listen(3000);
}
bootstrap();
