import { Injectable, Inject } from '@nestjs/common';
import { StorePositionDto } from './dto/storePosition.dto';
import { SupplyRepository } from './supply.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { DriverPositionDto } from './dto/DriverPosition.dto copy';
import { CustomerCoordinates } from './dto/CustomerCoordinates.dto';

@Injectable()
export class SupplyService {
  private broadcastRadius = 15; // Ban đầu đặt bán kính là 5 km
  // Giả sử có một danh sách các driver
  drivers: DriverPositionDto[] = [
    { id: 1, lat: 10.1234, lng: 106.5678 },
    { id: 2, lat: 10.2345, lng: 106.6789 },
    { id: 3, lat: 10.3456, lng: 106.789 },
    // ...
  ];
  constructor(
    private readonly supplyRepository: SupplyRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Manually trigger the cache update when the application starts
  async onApplicationBootstrap() {
    await this.supplyPosition();
    // await this.increaseRadius();
  }

  @Cron('*/10 * * * *') // Lên lịch thực hiện mỗi 10 phút
  async supplyPosition() {
    // console.log(storePositionDto);
    // Store the data in Redis using the address as the key
    // await this.redisClient.set(
    //   storePositionDto.address,
    //   JSON.stringify(storePositionDto),
    // );
    const userData = {
      latitude: 10.1234,
      longitude: 106.5678,
    };
    await this.cacheManager.set('driver', JSON.stringify(userData), {
      ttl: 600,
    });
    const redisData = await this.cacheManager.get('driver');
    console.log(redisData);
    console.log(`Data for driver updated in Redis.`);
    return { message: 'Position updated successfully' };
  }

  // Cài đặt hẹn giờ cho việc tăng bán kính sau 1 phút
  @Cron('*/1 * * * *') // Chạy mỗi phút
  increaseRadius() {
    this.broadcastRadius += 10; // Tăng bán kính lên thêm 10 mét
    console.log(this.broadcastRadius);
  }

  findDriversWithinRadius(customerCoordinates: {
    lat: number;
    lng: number;
  }): DriverPositionDto[] {
    // Lọc các driver nằm trong bán kính xung quanh tọa độ của khách hàng
    const driversWithinRadius = this.drivers.filter((driver) => {
      const distance = this.calculateDistance(
        customerCoordinates.lat,
        customerCoordinates.lng,
        driver.lat,
        driver.lng,
      );
      console.log(distance);
      return distance <= this.broadcastRadius;
    });

    return driversWithinRadius;
  }

  // Phương thức tính khoảng cách giữa hai điểm dựa vào công thức Haversine
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const earthRadius = 6371; // Bán kính trái đất (đơn vị: km)

    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    return distance; // km
  }

  // Hàm chuyển đổi độ sang radian
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  @Cron('*/1 * * * *') // Chạy mỗi phút
  broadcastToDrivers(customerCoordinates: CustomerCoordinates) {
    let driversWithinRadius = [];
    if (customerCoordinates) {
      driversWithinRadius = this.findDriversWithinRadius(customerCoordinates);
    } else {
    }
    console.log(driversWithinRadius);
    // Gửi thông báo broadcast tới các driver trong bán kính
    for (const driver of driversWithinRadius) {
      // Gửi thông báo tới driver
      console.log(`Sending broadcast to driver ${driver.id}`);
      // ... Gửi thông báo tới driver (sử dụng WebSockets, Socket.IO, RabbitMQ, etc.)
    }
  }
}
// sudo apt install redis-server
