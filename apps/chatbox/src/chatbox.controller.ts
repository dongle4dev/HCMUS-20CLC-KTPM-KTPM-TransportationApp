import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatboxService } from './chatbox.service';
import { User, UserInfo } from './decorators/user.decorator';
import { UserAuthGuard } from './guards/local-auth.guard';

@Controller('chatbox')
export class ChatboxController {
  constructor(private readonly chatboxService: ChatboxService) {}

  @UseGuards(new UserAuthGuard())
  @Post(':receiver')
  createChatBox(@Param('receiver') receiver: string, @User() user: UserInfo) {
    console.log(user.id, receiver);
    return this.chatboxService.createChatBox(user, receiver);
  }

  @UseGuards(new UserAuthGuard())
  @Delete(':chatBoxId')
  deleteChatBox(@Param('chatBoxId') chatBoxId: string, @User() user: UserInfo) {
    return this.chatboxService.deleteChatBox(user, chatBoxId);
  }

  @Get('user')
  getUserChatBox(@User() user: UserInfo) {
    return this.getUserChatBox(user);
  }
  @Get('getall')
  getAllChatBox() {
    return this.chatboxService.getAllChatBox();
  }
}
