import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { StorePositionDto } from './dto/storePosition.dto';
import { SupplyService } from './supply.service';

@Controller('discovery/supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get('/set')
  @UseInterceptors(CacheInterceptor)
  async supplyPosition(@Body() storePositionDto: StorePositionDto) {
    console.log('run it');
    // Call the supplyService method to get the supply position data
    const supplyData = await this.supplyService.supplyPosition();

    // Make sure the supplyData is not undefined
    if (supplyData !== undefined) {
      // Return the supplyData to be cached
      return supplyData;
    } else {
      // If supplyData is undefined, return an empty object or handle it as needed
      return {};
    }
  }

  // @Get('/get')
  // @UseInterceptors(CacheInterceptor)
  // async getUserFromRedis(): Promise<any> {
  //   const data = await this.supplyService.getUserFromRedis();

  //   console.log(data);
  //   return data;
  // }
}
