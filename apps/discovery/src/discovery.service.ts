import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { DiscoveryRepository } from './discovery.repository';

@Injectable()
export class DiscoveryService {
  constructor(
    private readonly discoveryRepository: DiscoveryRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getDriverData(): Promise<any> {
    console.log('Discovery Service');

    // Get data from the 'driver' cache
    const userDataString = await this.cacheManager.get<string>('driver');
    if (userDataString) {
      // Parse the JSON data back to an object and return it
      console.log('Return data driver');
      return JSON.parse(userDataString);
    } else {
      // If no data found for the 'driver' cache, return null or handle it as needed
      console.log('Return nothing');
      return null;
    }
  }
}
