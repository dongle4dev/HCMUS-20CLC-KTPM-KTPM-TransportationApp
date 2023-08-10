import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Hotline } from '../schema/hotline.schema';

@Injectable()
export class HotlinesRepository extends AbstractRepository<Hotline> {
  protected readonly logger = new Logger(HotlinesRepository.name);

  constructor(
    @InjectModel(Hotline.name) hotlineModel: Model<Hotline>,
    @InjectConnection() connection: Connection,
  ) {
    super(hotlineModel, connection);
  }
}
