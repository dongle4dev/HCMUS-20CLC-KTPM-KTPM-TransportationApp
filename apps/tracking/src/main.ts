import { NestFactory } from '@nestjs/core';
import { TrackingModule } from './tracking.module';

async function bootstrap() {
  const app = await NestFactory.create(TrackingModule);
  await app.listen(3000);
}
bootstrap();
