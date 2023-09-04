import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { findDriversWithinRadius } from 'y/common/utils/findDrivers';
import {
  ClientProxy,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { DRIVER_SERVICE } from 'y/common/constants/services';

@Injectable()
export class DemandService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(DRIVER_SERVICE) private driverClient: ClientProxy,
  ) {}

  async requestRideFromCustomer(customerPositionDto: CustomerPositionDto) {
    this.broadcastToDrivers(customerPositionDto);
  }

  async requestRideFromHotline(customerPositionDto: CustomerPositionDto) {
    if (!customerPositionDto.phone) {
      throw new BadRequestException('Please enter phone number');
    }
    this.broadcastToDrivers(customerPositionDto);
  }
  private async findDriversWithinLocation(
    customerPositionDto: CustomerPositionDto,
  ): Promise<DriverPositionDto[]> {
    let driversWithinRadius = [];
    const driversCache = JSON.parse(
      await this.cacheManager.get<string>('drivers'),
    );
    if (customerPositionDto) {
      driversWithinRadius = findDriversWithinRadius(
        customerPositionDto,
        driversCache,
      );
    } else {
    }
    return driversWithinRadius;
  }
  private async broadcastToDrivers(customerPositionDto: CustomerPositionDto) {
    const driversWithinRadius = await this.findDriversWithinLocation(
      customerPositionDto,
    );
    console.log('Driver in Cache: ', driversWithinRadius);
    const broadCastEvent = {
      eventId: uuidv4(),
      driverIdList: [],
      data: { customerPositionDto },
    };
    
    if (driversWithinRadius) {
      for (const driver of driversWithinRadius) {
        broadCastEvent.driverIdList.push(driver.id);
        console.log(`Sending broadcast to driver: ${driver.id}`);
        
        
      }
      await lastValueFrom(
        this.driverClient.emit('broadcast_driver', {
          broadCastEvent,
        }),
      );
    }
  }
}
