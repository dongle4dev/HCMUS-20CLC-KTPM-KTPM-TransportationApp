import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfo } from 'y/common/auth/user.decorator';
import { VehiclesRepository } from 'y/common/database/vehicle/repository/vehicles.repository';
import { Vehicle } from 'y/common/database/vehicle/schema/vehicle.schema';
import { CreateVehicleDto } from '../../../libs/common/src/dto/vehicle/dto/create.vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    // @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    private readonly vehicleRepository: VehiclesRepository,
  ) {}
  async createVehicle(vehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      const vehicle = await this.vehicleRepository.create(vehicleDto);
      return vehicle;
    } catch {
      throw new NotFoundException('Already have this license');
    }
  }

  async deleteDriverVehicle(id: string): Promise<{ msg: string }> {
    await this.vehicleRepository.delete({
      driver: id,
    });

    return { msg: `Delete ${id} vehicle successfully ` };
  }

  async getDriverVehicle(id: string) {
    return this.vehicleRepository.findOne({ driver: id });
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
