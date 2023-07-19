import { Module } from '@nestjs/common';
import { ChatboxController } from './chatbox.controller';
import { ChatboxService } from './chatbox.service';

@Module({
  imports: [],
  controllers: [ChatboxController],
  providers: [ChatboxService],
})
export class ChatboxModule {}
