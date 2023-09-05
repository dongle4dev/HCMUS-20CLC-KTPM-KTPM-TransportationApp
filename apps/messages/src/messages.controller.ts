import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CreateMessageDto } from '../../../libs/common/src/dto/message/dto/create.message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly rmqService: RmqService,
  ) {}

  @Post('/create')
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessageFromCustomer(createMessageDto);
  }

  @MessagePattern({ cmd: 'create_message_from_customer' })
  createMessageFromCustomer(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.messagesService.createMessageFromCustomer(
      data.createMessageDto,
    );
  }

  @MessagePattern({ cmd: 'create_message_from_driver' })
  createMessageFromDriver(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.messagesService.createMessageFromDriver(data.createMessageDto);
  }

  @MessagePattern({ cmd: 'get_messages_from_customer' })
  getMessagesFromCustomer(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.messagesService.getMessagesForUser(data.getMessagesDto);
  }

  @MessagePattern({ cmd: 'get_messages_from_driver' })
  getMessagesFromDriver(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.messagesService.getMessagesForUser(data.getMessagesDto);
  }

  @EventPattern('delete_messages_from_driver')
  deleteMessagesBothCustomerDriver(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.messagesService.deleteMessagesBothCustomerDriver(
      data.deleteMessagesDto,
    );
  }

  @Delete(':message')
  deleteMessage(@Param('message') message: string, @User() user: UserInfo) {
    return this.messagesService.deleteMessage();
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
