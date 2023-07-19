import { NestFactory } from '@nestjs/core';
import { ChatboxModule } from './chatbox.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatboxModule);
  await app.listen(3000);
}
bootstrap();
