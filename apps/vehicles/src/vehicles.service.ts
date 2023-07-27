import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfo } from 'y/common/auth/user.decorator';
import { CreateVehicleDto } from './dto/create.vehicle.dto';
import { Vehicle } from './schema/vehicle.schema';
import { VehiclesRepository } from './vehicles.repository';

@Injectable()
export class VehiclesService {
  constructor(
    // @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    private readonly vehicleRepository: VehiclesRepository,
  ) {}
  async createVehicle(
    driver: UserInfo,
    vehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    const { licensePlate, capacity } = vehicleDto;
    try {
      const vehicle = await this.vehicleRepository.create({
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
    await this.vehicleRepository.delete({
      owner: driver.id,
    });

    return { msg: `Delete ${driver.id} vehicle successfully ` };
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.find({});
    return vehicles;
  }
}
