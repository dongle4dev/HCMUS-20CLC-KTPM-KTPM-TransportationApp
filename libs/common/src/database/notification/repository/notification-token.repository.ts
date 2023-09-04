import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { NotificationToken } from '../schema/notification-token.schema';

@Injectable()
export class NotificationTokenRepository extends AbstractRepository<NotificationToken> {
  protected readonly logger = new Logger(NotificationTokenRepository.name);

  constructor(
    @InjectModel(NotificationToken.name) NotificationTokenModel: Model<NotificationToken>,
    @InjectConnection() connection: Connection,
  ) {
    super(NotificationTokenModel, connection);
  }
}
