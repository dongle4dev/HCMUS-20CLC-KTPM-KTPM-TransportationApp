import { Body, Controller, Get, Post } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DemandService } from './demand.service';

@Controller('demand')
export class DemandController {
  constructor(private readonly demandService: DemandService) {}

  @Get('/drivers')
  // @UseInterceptors(CacheInterceptor)
  async requestRide(@Body() customerPositionDto: CustomerPositionDto) {
    return this.demandService.requestRideFromHotline(customerPositionDto);
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return { user: 'USER' };
  }

  @Post('/test/send-msg')
  async sendMessage() {
    return this.demandService.sendMessage('Hello 123456');
  }
}
