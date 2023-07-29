import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('get-cache')
  @UseInterceptors(CacheInterceptor)
  async GetCache() {
    const data = await this.discoveryService.getDriverData();
    console.log(data);
    return data;
  }
}
