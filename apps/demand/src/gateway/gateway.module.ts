import { Module } from '@nestjs/common';
import { DemandGateway } from './gateway';

@Module({
  imports: [],
  providers: [DemandGateway],
  exports: [DemandGateway],
})
export class GatewayModule {}
