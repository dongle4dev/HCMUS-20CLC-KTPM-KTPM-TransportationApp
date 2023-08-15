import { Injectable } from '@nestjs/common';
import { DriversServiceFacade } from 'apps/drivers/src/drivers.facade.service';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip } from 'y/common/database/trip/schema/trip.schema';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { Observer } from 'y/common/interface/observer.interface';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { SaveOptions } from 'mongoose';

@Injectable()
export class TripService {
  constructor(
    private readonly tripRepository: TripRepository, // private readonly driverService: DriversServiceFacade,
  ) {}

  // private observers: Observer[] = [];

  // // Phương thức này được gọi khi cập nhật vị trí của tài xế
  // updateDriverLocation(driverPositionDto: DriverPositionDto) {
  //   // Cập nhật logic vị trí
  //   // ...
  //   this.driverService.updateLocationFacade(driverPositionDto);
  //   // Gọi phương thức thông báo tới tất cả các Observer
  //   this.notifyObservers(driverPositionDto);
  // }

  // // Đăng ký Observer
  // addObserver(observer: Observer) {
  //   this.observers.push(observer);
  // }

  // // Phương thức thông báo tới tất cả các Observer
  // private notifyObservers(driverPositionDto: DriverPositionDto) {
  //   for (const observer of this.observers) {
  //     observer.update(driverPositionDto);
  //   }
  // }

  async createTrip(
    request: CreateTripDto,
    options?: SaveOptions,
  ): Promise<Trip> {
    return this.tripRepository.create(request, options);
  }

  async getAllTrip(): Promise<Trip[]> {
    return this.tripRepository.find({});
  }

  async updateTrip(id: string, request: UpdateTripDto): Promise<Trip> {
    return this.tripRepository.findOneAndUpdate({ id }, { request });
  }

  async deleteAllTrip(): Promise<{ msg: string }> {
    await this.tripRepository.deleteMany({});
    return { msg: 'Delete All the Trip in hotline ' };
  }
  async findTripForTracking(id: string): Promise<Trip> {
    return this.tripRepository.findOne({ _id: id });
  }

  async updateTripStatus(data: any) {
    return null;
  }
}
