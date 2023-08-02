import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Discovery } from '../schema/discovery.schema';

@Injectable()
export class DiscoveryRepository extends AbstractRepository<Discovery> {
  protected readonly logger = new Logger(DiscoveryRepository.name);

  constructor(
    @InjectModel(Discovery.name) discoveryModel: Model<Discovery>,
    @InjectConnection() connection: Connection,
  ) {
    super(discoveryModel, connection);
  }
}
