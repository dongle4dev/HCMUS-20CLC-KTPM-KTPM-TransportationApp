import { NestFactory } from '@nestjs/core';
import { DriversModule } from './drivers.module';

async function bootstrap() {
  const app = await NestFactory.create(DriversModule);
  await app.listen(3000);
}
bootstrap();
