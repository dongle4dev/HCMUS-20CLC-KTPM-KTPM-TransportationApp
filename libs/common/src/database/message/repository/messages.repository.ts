import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Message } from '../schema/message.schema';

@Injectable()
export class MessagesRepository extends AbstractRepository<Message> {
  protected readonly logger = new Logger(MessagesRepository.name);

  constructor(
    @InjectModel(Message.name) messageModel: Model<Message>,
    @InjectConnection() connection: Connection,
  ) {
    super(messageModel, connection);
  }
}
