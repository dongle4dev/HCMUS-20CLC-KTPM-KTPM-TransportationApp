import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupplyService } from 'apps/supply/src/supply.service';
import { Cache } from 'cache-manager';
import { findDriversWithinRadius } from 'utils/findDrivers';
import { UserInfo } from 'y/common/auth/user.decorator';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { DRIVER_SERVICE } from './constants/services';
import { lastValueFrom } from 'rxjs';

import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class DemandService {
  private client: ClientProxy;
  constructor(
    private readonly supplySerivce: SupplyService,
    private readonly driversRepository: DriversRepository,
    private readonly customersRepository: CustomersRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(DRIVER_SERVICE) private driverClient: ClientProxy,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://username:password@localhost:5672'], // Replace with your RabbitMQ connection URI
        queue: 'demand_queue', // Queue name for consumers
        queueOptions: { durable: false },
      },
    });
  }

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

    const broadCastEvent = {
      eventId: uuidv4(),
      driverIdList: [],
      data: { customerPositionDto },
    };
    // Gửi thông báo broadcast tới các driver trong bán kính
    for (const driver of driversWithinRadius) {
      try {
        const driverInfo = await this.driversRepository.findOne({
          _id: driver.id,
        });
        // Gửi thông báo tới driver
        if (!driverInfo) {
          console.log(`Don't have driver with id: ${driver.id} in database`);
        } else {
          broadCastEvent.driverIdList.push(driverInfo._id);

          console.log(`Sending broadcast to driver: ${driver.id}`);
        }
        // ... Gửi thông báo tới driver (sử dụng WebSockets, Socket.IO, RabbitMQ, etc.)
      } catch (e) {
        console.log(`Don't have driver with id: ${driver.id}`);
      }
    }
    for (let i = 0; i < 2; i++) {
      await this.client.emit<string>('broadcast_driver', broadCastEvent);
    }
  }

  async sendMessage(message: string) {
    return this.client.emit('message', message);
  }
}

// await lastValueFrom(
//   this.driverClient.emit('broadcast_driver', {
//     customerPositionDto,
//   }),
// );
