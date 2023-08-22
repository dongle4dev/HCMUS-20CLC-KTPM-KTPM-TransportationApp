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

  @Post('/drivers')
  async requestRideFromHotline(
    @Body() customerPositionDto: CustomerPositionDto,
  ) {
    return this.demandService.requestRideFromHotline(customerPositionDto);
  }

  @EventPattern('demand_broadcast_driver')
  async broadCastCustomerPosition(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.demandService.requestRideFromHotline(data.customerPositionDto);
  }
}
