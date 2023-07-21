import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfo } from './decorators/user.decorator';
import { CreateVehicleDto } from './dto/create.vehicle.dto';
import { Vehicle } from './schema/vehicle.schema';
import { VehicleController } from './vehicle.controller';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}
  async createVehicle(
    driver: UserInfo,
    vehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    const { licensePlate, capacity } = vehicleDto;
    try {
      const vehicle = await this.vehicleModel.create({
        licensePlate,
        capacity,
        owner: driver.id,
      });
      return vehicle;
    } catch {
      throw new NotFoundException('Already have this license');
    }
  }

  async deleteVehicle(driver: UserInfo): Promise<{ msg: string }> {
    const deleted = await this.vehicleModel.findOneAndRemove({
      owner: driver.id,
    });
    if (deleted) {
      return { msg: `Delete ${driver.id} vehicle successfully ` };
    } else {
      throw new NotFoundException('User does not have any vehicle to delete');
    }
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleModel.find({}).exec();
    return vehicles;
  }
}
