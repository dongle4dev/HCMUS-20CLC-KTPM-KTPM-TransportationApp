import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { ChatboxService } from './chatbox.service';

@Controller('chatbox')
export class ChatboxController {
  constructor(private readonly chatboxService: ChatboxService) {}
  @Delete('all')
  deleteAllChatBox() {
    return this.chatboxService.deleteAllChatBox();
  }
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
    return this.chatboxService.getAllUserChatBox(user);
  }
  @Get('getall')
  getAllChatBox() {
    return this.chatboxService.getAllChatBox();
  }
}
