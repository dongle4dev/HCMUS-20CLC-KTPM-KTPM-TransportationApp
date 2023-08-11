import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'y/common';
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
