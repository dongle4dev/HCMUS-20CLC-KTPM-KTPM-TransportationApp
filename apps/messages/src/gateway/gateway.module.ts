import { Module } from '@nestjs/common';
import { MessagesModule } from '../messages.module';
import { MessageGateway } from './gateway';

@Module({
  providers: [MessageGateway],
  exports: [MessageGateway],
})
export class GatewayModule {}
