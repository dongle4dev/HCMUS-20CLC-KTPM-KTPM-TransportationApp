import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessagesRepository } from 'y/common/database/message/repository/messages.repository';
import { Message } from 'y/common/database/message/schema/message.schema';
import { DeleteMessagesDto } from 'y/common/dto/message/dto/delete.message.dto';
import { CreateMessageDto } from '../../../libs/common/src/dto/message/dto/create.message.dto';
import { GetMessagesDto } from '../../../libs/common/src/dto/message/dto/get.messages.dto';
import { MessageGateway } from './gateway/gateway';

@Injectable()
export class MessagesService {
  constructor(
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
    const messages: Message[] = [
      ...messagesFromCustomer,
      ...messagesFromDriver,
    ];
    messages.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

    return messages;
  }

  async deleteMessagesBothCustomerDriver(deleteMessagesDto: DeleteMessagesDto) {
    const { customer, driver } = deleteMessagesDto;
    const messageCustomerSent = await this.messageRepository.find({
      customer_send: customer,
      driver_receive: driver,
    });
    if (messageCustomerSent.length) {
      try {
        await this.messageRepository.deleteMany({
          customer_send: customer,
          driver_receive: driver,
        });
      } catch (error) {
        // Handle any errors that might occur during the deletion process
        console.error('Error deleting chat messages:', error);
        throw error; // Rethrow the error or handle it according to your needs
      }
    }
    const messageDriverSent = await this.messageRepository.find({
      driver_send: driver,
      customer_receive: customer,
    });
    if (messageDriverSent.length) {
      try {
        await this.messageRepository.deleteMany({
          driver_send: driver,
          customer_receive: customer,
        });
      } catch (error) {
        // Handle any errors that might occur during the deletion process
        console.error('Error deleting chat messages:', error);
        throw error; // Rethrow the error or handle it according to your needs
      }
    }
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
