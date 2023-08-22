import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { FeedBack } from '../schema/feedback.schema';

@Injectable()
export class FeedBacksRepository extends AbstractRepository<FeedBack> {
  protected readonly logger = new Logger(FeedBacksRepository.name);

  constructor(
    @InjectModel(FeedBack.name) feedBackModel: Model<FeedBack>,
    @InjectConnection() connection: Connection,
  ) {
    super(feedBackModel, connection);
  }
}
