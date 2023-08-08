import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Location } from '../schema/location.schema';

@Injectable()
export class LocationsRepository extends AbstractRepository<Location> {
  protected readonly logger = new Logger(LocationsRepository.name);

  constructor(
    @InjectModel(Location.name) locationModel: Model<Location>,
    @InjectConnection() connection: Connection,
  ) {
    super(locationModel, connection);
  }
}
