import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { ChatBox } from './schema/chatbox.schema';

@Injectable()
export class ChatboxesRepository extends AbstractRepository<ChatBox> {
  protected readonly logger = new Logger(ChatboxesRepository.name);

  constructor(
    @InjectModel(ChatBox.name) ChatboxesModel: Model<ChatBox>,
    @InjectConnection() connection: Connection,
  ) {
    super(ChatboxesModel, connection);
  }
}
