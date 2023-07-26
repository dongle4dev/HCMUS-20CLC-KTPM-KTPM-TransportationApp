import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CreateMessage } from './dto/create.message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(new UserAuthGuard())
  @Post(':sendTo')
  createMessage(
    @Param('sendTo') sendTo: string,
    @User() user: UserInfo,
    @Body() content: CreateMessage,
  ) {
    console.log(user.id, sendTo, content);
    return this.messagesService.createMessage(user, sendTo, content);
  }

  @UseGuards(new UserAuthGuard())
  @Delete(':message')
  deleteMessage(@Param('message') message: string, @User() user: UserInfo) {
    return this.messagesService.deleteMessage(user, message);
  }
  @Get('')
  getAllMessages() {
    return this.messagesService.getAllMessage();
  }
  @Delete('delete/all')
  deleteAllMessage() {
    return this.messagesService.deleteAllMessage();
  }
}
