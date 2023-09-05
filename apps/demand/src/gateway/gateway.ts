import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['*'],
  },
})
export class DemandGateway implements OnModuleInit {
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

  @SubscribeMessage('createTrip')
  async sendRequestTripMessage(
    @MessageBody() tripRequest: any,
    driverId: string
  ): Promise<void> {
    console.log('Body: ', tripRequest);
    
    this.server.emit(`${driverId}`, {
      content: tripRequest,
    });
  } 

  @SubscribeMessage('acceptTrip')
  async acceptTrip(
    @MessageBody() tripRequest: any,
    driverId: string
  ): Promise<void> {
    console.log('Accept trip: ', tripRequest);
    
    this.server.emit(`${driverId}`, {
      msg: 'Accept trip successfully!',
      content: tripRequest
    });

    this.server.emit(`${tripRequest._id}`, {
      msg: 'Accept trip successfully!',
      content: tripRequest
    });
  } 

  @SubscribeMessage('updateTrip')
  async updateTrip(
    @MessageBody() tripRequest: any,
  ): Promise<void> {
    console.log('Update trip: ', tripRequest);
    
    this.server.emit(`${tripRequest._id}`, {
      msg: 'Update trip successfully!',
      content: tripRequest
    });
  } 
}
