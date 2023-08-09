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

@Injectable()
export class DemandService {
  constructor(
    private readonly supplySerivce: SupplyService,
    private readonly driversRepository: DriversRepository,
    private readonly customersRepository: CustomersRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
          console.log(`Sending broadcast to driver: ${driver.id}`);
        }
        // ... Gửi thông báo tới driver (sử dụng WebSockets, Socket.IO, RabbitMQ, etc.)
      } catch (e) {
        console.log(`Don't have driver with id: ${driver.id}`);
      }
    }
  }
}
