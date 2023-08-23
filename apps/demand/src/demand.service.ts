import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupplyService } from 'apps/supply/src/supply.service';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { UserInfo } from 'y/common/auth/user.decorator';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { findDriversWithinRadius } from 'y/common/utils/findDrivers';

import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { DRIVER_SERVICE } from 'y/common/constants/services';
import { DemandRepository } from 'y/common/database/discovery/demand/repository/demand.repository';
@Injectable()
export class DemandService {
  constructor(
    // private readonly supplySerivce: SupplyService,
    private readonly demandRepository: DemandRepository,
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
    // Gửi thông báo broadcast tới các driver trong bán kính
    if (driversWithinRadius) {
      for (const driver of driversWithinRadius) {
        broadCastEvent.driverIdList.push(driver.id);
        console.log(`Sending broadcast to driver: ${driver.id}`);
        // ... Gửi thông báo tới driver (sử dụng WebSockets, Socket.IO, RabbitMQ, etc.)
      }
      await lastValueFrom(
        this.driverClient.emit('broadcast_driver', {
          broadCastEvent,
        }),
      );
    }
  }
}
