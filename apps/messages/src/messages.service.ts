import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatboxesRepository } from 'apps/chatboxes/src/chatboxes.repository';
import { ChatboxesService } from 'apps/chatboxes/src/chatboxes.service';
import { UserInfo } from 'y/common/auth/user.decorator';
import { MessagesRepository } from 'y/common/database/message/repository/messages.repository';
import { Message } from 'y/common/database/message/schema/message.schema';
import { CreateMessageDto } from './dto/create.message.dto';
import { GetMessagesDto } from './dto/get.messages.dto';
import { MessageGateway } from './gateway/gateway';

@Injectable()
export class MessagesService {
  constructor(
    // @InjectModel(Customer.name) private customerModel: Model<Customer>,
    // @InjectModel(ChatBox.name) private chatboxModel: Model<ChatBox>,
    // @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly messageRepository: MessagesRepository,
    private readonly messageGateway: MessageGateway,
  ) {}
  async createMessageFromCustomer(createMessageDto: CreateMessageDto) {
    const message = await this.messageRepository.create(createMessageDto);

    await this.messageGateway.handleMessage(message, 'Customer');
    return message;
  }

  async createMessageFromDriver(createMessageDto: CreateMessageDto) {
    const message = await this.messageRepository.create(createMessageDto);

    await this.messageGateway.handleMessage(message, 'Driver');
    return message;
  }

  async getMessagesForUser(getMessagesDto: GetMessagesDto) {
    const messagesFromCustomer = await this.messageRepository.find({
      customer_send: getMessagesDto.customer,
      driver_receive: getMessagesDto.driver,
    });
    const messagesFromDriver = await this.messageRepository.find({
      driver_send: getMessagesDto.driver,
      customer_receive: getMessagesDto.customer,
    });
    return [...messagesFromCustomer, ...messagesFromDriver];
  }

  async deleteMessage() {
    return null;
  }

  async getAllMessage(): Promise<Message[]> {
    return this.messageRepository.find({});
  }
  async deleteAllMessage(): Promise<{ msg: string }> {
    try {
      const result = await this.messageRepository.deleteMany({}); // Pass an empty object as the filter
      return { msg: 'Deleted All' };
    } catch (error) {
      // Handle any errors that might occur during the deletion process
      console.error('Error deleting chat boxes:', error);
      throw error; // Rethrow the error or handle it according to your needs
    }
  }
}
