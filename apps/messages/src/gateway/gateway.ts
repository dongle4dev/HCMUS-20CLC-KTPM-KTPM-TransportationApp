import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { CUSTOMER_SERVICE, DRIVER_SERVICE } from 'y/common/constants/services';
import { CreateMessageDto } from '../dto/create.message.dto';
import { MessagesService } from '../messages.service';

@WebSocketGateway({})
export class MessageGateway implements OnModuleInit {
  constructor(
    @Inject(DRIVER_SERVICE) private readonly driverClient: ClientProxy,
    @Inject(CUSTOMER_SERVICE) private readonly customerClient: ClientProxy,
  ) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket ID: ', socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log('Body: ', body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() messageDto: any,
    role: string,
  ): Promise<void> {
    console.log('Body: ', messageDto);

    this.server.emit('message', {
      msg: `Message From ${role}`,
      content: messageDto,
    });
    if (role === 'Customer') {
      await lastValueFrom(
        this.driverClient.emit('send_message_from_customer', {
          messageDto,
        }),
      );
    } else if (role === 'Driver') {
      await lastValueFrom(
        this.customerClient.emit('send_message_from_driver', {
          messageDto,
        }),
      );
    }
  }
}
