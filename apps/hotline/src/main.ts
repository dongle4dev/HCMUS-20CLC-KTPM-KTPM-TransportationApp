import { NestFactory } from '@nestjs/core';
import { HotlineModule } from './hotline.module';

async function bootstrap() {
  const app = await NestFactory.create(HotlineModule);
  await app.listen(3000);
}
bootstrap();
