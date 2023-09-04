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

@WebSocketGateway({
  cors: {
    origin: ['*'],
  },
})
export class DemandGateway implements OnModuleInit {
  // constructor(
  //   @Inject(DRIVER_SERVICE) private readonly driverClient: ClientProxy,
  //   @Inject(CUSTOMER_SERVICE) private readonly customerClient: ClientProxy,
  // ) {}
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

  // @SubscribeMessage('sendMessage')
  // async handleMessage(
  //   @MessageBody() messageDto: any,
  //   role: string,
  // ): Promise<void> {
  //   console.log('Body: ', messageDto);
  //   let msg, customerId, driverId;
  //   if (role === 'Customer') {
  //     customerId = messageDto.customer_send;
  //     driverId = messageDto.driver_receive;
  //     msg = `Message From Customer (${customerId}) send to Driver (${driverId})`;
  //     await lastValueFrom(
  //       this.driverClient.emit('send_message_from_customer', {
  //         messageDto,
  //       }),
  //     );
  //   } else if (role === 'Driver') {
  //     customerId = messageDto.customer_receive;
  //     driverId = messageDto.driver_send;
  //     msg = `Message From Driver (${driverId}) send to Customer (${customerId})`;
  //     await lastValueFrom(
  //       this.customerClient.emit('send_message_from_driver', {
  //         messageDto,
  //       }),
  //     );
  //   }
  //   this.server.emit(`message_${customerId}_${driverId}`, {
  //     msg,
  //     content: messageDto,
  //   });
  // }
}
