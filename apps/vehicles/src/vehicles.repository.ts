import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Vehicle } from './schema/vehicle.schema';

@Injectable()
export class VehiclesRepository extends AbstractRepository<Vehicle> {
  protected readonly logger = new Logger(VehiclesRepository.name);

  constructor(
    @InjectModel(Vehicle.name) vehicleModel: Model<Vehicle>,
    @InjectConnection() connection: Connection,
  ) {
    super(vehicleModel, connection);
  }
}
