import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from 'y/common';
import { Demand } from '../schema/demand.schema';

@Injectable()
export class DemandRepository extends AbstractRepository<Demand> {
  protected readonly logger = new Logger(DemandRepository.name);

  constructor(
    @InjectModel(Demand.name) demandModel: Model<Demand>,
    @InjectConnection() connection: Connection,
  ) {
    super(demandModel, connection);
  }
}
