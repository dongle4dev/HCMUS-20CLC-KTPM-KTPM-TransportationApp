import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { SupplyRepository } from 'y/common/database/discovery/supply/repository/supply.repository';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { findDriversWithinRadius } from 'y/common/utils/findDrivers';

@Injectable()
export class SupplyService {
  private broadcastRadius = 20; // Ban đầu đặt bán kính là 5 km
  // Giả sử có một danh sách các driver
  drivers: DriverPositionDto[] = [];
  constructor(
    private readonly supplyRepository: SupplyRepository,
    private readonly driversRepository: DriversRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }
  async getDriversPositon() {
    // return this.drivers;
    const drivers = JSON.parse(await this.cacheManager.get('drivers'));
    // console.log(drivers);
    return drivers;
  }

  async updateDriverLocation(driverPositionDto: DriverPositionDto) {
    const { id } = driverPositionDto;
    const driversArray = (await this.getDriversPositon()) || [];
    // Check if the driver with the given id already exists in the drivers array
    const existingDriverIndex = driversArray.findIndex(
      (driver) => driver.id === id,
    );

    if (existingDriverIndex !== -1) {
      // If the driver with the same id exists, replace the existing data with the new driverPositionDto
      driversArray[existingDriverIndex] = driverPositionDto;
    } else {
      // If the driver with the same id does not exist, push the new driverPositionDto into the drivers array
      driversArray.push(driverPositionDto);
    }
    console.log(driversArray);

    await this.cacheManager.set('drivers', JSON.stringify(driversArray), {
      ttl: 600,
    });
  }

  // Manually trigger the cache update when the application starts
  async onApplicationBootstrap() {
    // await this.supplyPosition();
    // await this.increaseRadius();
  }

  // @Cron('*/10 * * * *') // Lên lịch thực hiện mỗi 10 phút
  async supplyPosition(driverPositionDto: DriverPositionDto) {
    await this.updateDriverLocation(driverPositionDto);
    await this.cacheManager.set(
      driverPositionDto.id,
      JSON.stringify(driverPositionDto),
      {
        ttl: 600,
      },
    );

    // const redisData = await this.cacheManager.get(driverPositionDto.id);
    // console.log(redisData);
    console.log(`Data for driver updated in Redis.`);
    return { message: 'Position updated successfully' };
  }

  // Cài đặt hẹn giờ cho việc tăng bán kính sau 1 phút
  // @Cron('*/1 * * * *') // Chạy mỗi phút
  increaseRadius() {
    this.broadcastRadius += 10; // Tăng bán kính lên thêm 10 mét
    console.log(this.broadcastRadius);
  }

  @Cron('*/10 * * * *') // Chạy mỗi phút
  async resetDriversPosition() {
    this.drivers = [];
    await this.cacheManager.set('drivers', JSON.stringify(this.drivers), {
      ttl: 600,
    });
    console.log(await this.getDriversPositon());
  }

  // @Cron('*/1 * * * *') // Chạy mỗi phút
  async broadcastToDrivers(customerPositionDto: CustomerPositionDto) {
    let driversWithinRadius = [];
    const driversCache = JSON.parse(await this.cacheManager.get('drivers'));
    if (customerPositionDto) {
      driversWithinRadius = findDriversWithinRadius(
        customerPositionDto,
        driversCache,
      );
    } else {
    }
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
// sudo apt install redis-server
