import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { DriverPositionDto } from './dto/DriverPosition.dto';
import { CustomerCoordinates } from './dto/CustomerCoordinates.dto';
import { calculateDistance } from 'utils/calculate';
import { findDriversWithinRadius } from './utils/findDrivers';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { SupplyRepository } from 'y/common/database/discovery/supply/repository/supply.repository';

@Injectable()
export class SupplyService {
  private broadcastRadius = 20; // Ban đầu đặt bán kính là 5 km
  // Giả sử có một danh sách các driver
  drivers: DriverPositionDto[] = [];
  constructor(
    private readonly supplyRepository: SupplyRepository,
    private readonly driversRepository: DriversRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Manually trigger the cache update when the application starts
  async onApplicationBootstrap() {
    // await this.supplyPosition();
    // await this.increaseRadius();
  }

  // @Cron('*/10 * * * *') // Lên lịch thực hiện mỗi 10 phút
  async supplyPosition(driverPositionDto: DriverPositionDto) {
    // console.log(driverPositionDto);
    const { id, lat, lng, day } = driverPositionDto;
    const userData = {
      id: id,
      lat: lat,
      lng: lng,
      day: day,
    };
    // Check if the driver with the given id already exists in the drivers array
    const existingDriverIndex = this.drivers.findIndex(
      (driver) => driver.id === id,
    );

    if (existingDriverIndex !== -1) {
      // If the driver with the same id exists, replace the existing data with the new userData
      this.drivers[existingDriverIndex] = userData;
    } else {
      // If the driver with the same id does not exist, push the new userData into the drivers array
      this.drivers.push(userData);
    }
    console.log(this.drivers);
    await this.cacheManager.set(userData.id, JSON.stringify(userData), {
      ttl: 600,
    });
    // const redisData = await this.cacheManager.get(userData.id);
    // console.log(redisData);
    console.log(`Data for driver updated in Redis.`);
    return { message: 'Position updated successfully' };
  }

  // Cài đặt hẹn giờ cho việc tăng bán kính sau 1 phút
  @Cron('*/1 * * * *') // Chạy mỗi phút
  increaseRadius() {
    this.broadcastRadius += 10; // Tăng bán kính lên thêm 10 mét
    console.log(this.broadcastRadius);
  }

  @Cron('*/10 * * * *') // Chạy mỗi phút
  resetDriversPosition() {
    this.drivers = [];
  }

  // @Cron('*/1 * * * *') // Chạy mỗi phút
  async broadcastToDrivers(customerCoordinates: CustomerCoordinates) {
    let driversWithinRadius = [];
    if (customerCoordinates) {
      driversWithinRadius = findDriversWithinRadius(
        customerCoordinates,
        this.broadcastRadius,
        this.drivers,
      );
    } else {
    }
    console.log(driversWithinRadius);
    // Gửi thông báo broadcast tới các driver trong bán kính
    for (const driver of driversWithinRadius) {
      try {
        const driverInfo = await this.driversRepository.findOne({
          _id: driver.id,
        });
        // Gửi thông báo tới driver
        console.log(driverInfo);
        console.log(`Sending broadcast to driver: ${driver.id}`);
        // ... Gửi thông báo tới driver (sử dụng WebSockets, Socket.IO, RabbitMQ, etc.)
      } catch (e) {
        console.log(`Don't have driver with id: ${driver.id}`);
      }
    }
  }
}
// sudo apt install redis-server
