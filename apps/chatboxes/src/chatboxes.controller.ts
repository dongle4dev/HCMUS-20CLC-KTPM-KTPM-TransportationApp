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
import { ChatboxesService } from './chatboxes.service';

@Controller('chatboxes')
export class ChatboxesController {
  constructor(private readonly chatboxesService: ChatboxesService) {}
  @Delete('all')
  deleteAllChatBox() {
    return this.chatboxesService.deleteAllChatBox();
  }
  @UseGuards(new UserAuthGuard())
  @Post(':receiver')
  createChatBox(@Param('receiver') receiver: string, @User() user: UserInfo) {
    console.log(user.id, receiver);
    return this.chatboxesService.createChatBox(user, receiver);
  }

  @UseGuards(new UserAuthGuard())
  @Delete(':chatBoxId')
  deleteChatBox(@Param('chatBoxId') chatBoxId: string, @User() user: UserInfo) {
    return this.chatboxesService.deleteChatBox(user, chatBoxId);
  }
  @UseGuards(new UserAuthGuard())
  @Get('user')
  getUserChatBox(@User() user: UserInfo) {
    return this.chatboxesService.getAllUserChatBox(user);
  }
  @Get('getall')
  getAllChatBox() {
    return this.chatboxesService.getAllChatBox();
  }
}
