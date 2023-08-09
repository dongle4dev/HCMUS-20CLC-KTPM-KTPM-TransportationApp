import { Body, Controller, Get } from '@nestjs/common';
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
}
