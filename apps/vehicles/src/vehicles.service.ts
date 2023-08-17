import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfo } from 'y/common/auth/user.decorator';
import { VehiclesRepository } from 'y/common/database/vehicle/repository/vehicles.repository';
import { Vehicle } from 'y/common/database/vehicle/schema/vehicle.schema';
import { CreateVehicleDto } from './dto/create.vehicle.dto';

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

  async deleteDriverVehicle(driver: UserInfo): Promise<{ msg: string }> {
    await this.vehicleRepository.delete({
      owner: driver.id,
    });

    return { msg: `Delete ${driver.id} vehicle successfully ` };
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.find({});
    return vehicles;
  }

  async deleteVehicle(vehicleID: string): Promise<{ msg: string }> {
    await this.vehicleRepository.delete({ _id: vehicleID });
    return { msg: `Delete vehicle with id ${vehicleID} successfully` };
  }
}
