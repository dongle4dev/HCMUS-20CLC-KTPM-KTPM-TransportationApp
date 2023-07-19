import { Controller, Get } from '@nestjs/common';
import { ChatboxService } from './chatbox.service';

@Controller()
export class ChatboxController {
  constructor(private readonly chatboxService: ChatboxService) {}

  @Get()
  getHello(): string {
    return this.chatboxService.getHello();
  }
}
