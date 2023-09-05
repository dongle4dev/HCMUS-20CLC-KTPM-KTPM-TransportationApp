import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DemandService } from './demand.service';

@Controller('demand')
export class DemandController {
  constructor(
    private readonly demandService: DemandService,
    private readonly rmqService: RmqService,
    
  ) {}

  @EventPattern('demand_broadcast_driver_from_hotline')
  async broadCastDriversFromHotline(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);

    return this.demandService.requestRideFromHotline(data);
  }


  @EventPattern('demand_broadcast_driver_from_customer')
  async broadCastDriversFromCustomer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);

    return this.demandService.requestRideFromHotline(data);
  }

  @Post('/broadcast')
  async broadCastDrivers(@Body() data: any) {
    return this.demandService.requestRideFromHotline(data);
  }
}
