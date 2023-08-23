import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Body, Controller, Get, UseInterceptors } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from 'y/common';

@Controller('supply')
export class SupplyController {
  constructor(
    private readonly supplyService: SupplyService,
    private readonly rmqService: RmqService, // @Inject('DEMAND_SERVICE') private demandService: ClientProxy,
  ) {}

  @Get('/set-driver-coordinates')
  @UseInterceptors(CacheInterceptor)
  async supplyPosition(@Body() driverPositionDto: DriverPositionDto) {
    console.log('run it');
    // Call the supplyService method to get the supply position data
    const supplyData = await this.supplyService.supplyPosition(
      driverPositionDto,
    );

    // Make sure the supplyData is not undefined
    if (supplyData !== undefined) {
      // Return the supplyData to be cached
      return supplyData;
    } else {
      // If supplyData is undefined, return an empty object or handle it as needed
      return {};
    }
  }

  @Get('/drivers')
  // @UseInterceptors(CacheInterceptor)
  async broadcastToDrivers(@Body() customerPositionDto: CustomerPositionDto) {
    return this.supplyService.broadcastToDrivers(customerPositionDto);
  }

  @Get('/get-drivers')
  async getDrivers() {
    return this.supplyService.getDriversPositon();
  }

  @EventPattern('supply_driver_position')
  async updateDriverPosition(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.rmqService.ack(context);
    this.supplyService.updateDriverLocation(data.driverPositionDto);
  }
  // @Get('/get')
  // @UseInterceptors(CacheInterceptor)
  // async getUserFromRedis(): Promise<any> {
  //   const data = await this.supplyService.getUserFromRedis();

  //   console.log(data);
  //   return data;
  // }
}
