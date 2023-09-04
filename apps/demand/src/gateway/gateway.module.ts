import { Module } from '@nestjs/common';
import { CUSTOMER_SERVICE, DRIVER_SERVICE } from 'y/common/constants/services';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { DemandGateway } from './gateway';

@Module({
  imports: [
    // RmqModule,
    // RmqModule.register({
    //   name: CUSTOMER_SERVICE,
    // }),
    // RmqModule.register({
    //   name: DRIVER_SERVICE,
    // }),
  ],
  providers: [DemandGateway],
  exports: [DemandGateway],
})
export class GatewayModule {}
