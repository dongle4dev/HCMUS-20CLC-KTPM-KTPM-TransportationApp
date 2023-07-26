import { NestFactory } from '@nestjs/core';
import { HotlinesModule } from './hotlines.module';

async function bootstrap() {
  const app = await NestFactory.create(HotlinesModule);
  await app.listen(3000);
}
bootstrap();
