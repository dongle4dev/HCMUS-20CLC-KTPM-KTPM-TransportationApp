import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from 'y/common';
import { Supply } from '../schema/supply.schema';

@Injectable()
export class SupplyRepository extends AbstractRepository<Supply> {
  protected readonly logger = new Logger(SupplyRepository.name);

  constructor(
    @InjectModel(Supply.name) supplyModel: Model<Supply>,
    @InjectConnection() connection: Connection,
  ) {
    super(supplyModel, connection);
  }
}
