import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Trip } from '../schema/trip.schema';

@Injectable()
export class TripRepository extends AbstractRepository<Trip> {
  protected readonly logger = new Logger(TripRepository.name);

  constructor(
    @InjectModel(Trip.name) TripModel: Model<Trip>,
    @InjectConnection() connection: Connection,
  ) {
    super(TripModel, connection);
  }
}
