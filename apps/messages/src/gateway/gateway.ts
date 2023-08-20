import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../dto/create.message.dto';
import { MessagesService } from '../messages.service';

@WebSocketGateway({})
export class MessageGateway implements OnModuleInit {
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
  }
}
