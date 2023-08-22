import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Notification } from '../schema/notification.schema';

@Injectable()
export class NotificationsRepository extends AbstractRepository<Notification> {
  protected readonly logger = new Logger(NotificationsRepository.name);

  constructor(
    @InjectModel(Notification.name) notificationModel: Model<Notification>,
    @InjectConnection() connection: Connection,
  ) {
    super(notificationModel, connection);
  }
}
