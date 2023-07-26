import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Driver } from './schemas/driver.schema';

@Injectable()
export class DriversRepository extends AbstractRepository<Driver> {
  protected readonly logger = new Logger(DriversRepository.name);

  constructor(
    @InjectModel(Driver.name) driverModel: Model<Driver>,
    @InjectConnection() connection: Connection,
  ) {
    super(driverModel, connection);
  }
}
