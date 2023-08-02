import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatboxesRepository } from 'apps/chatboxes/src/chatboxes.repository';
import { ChatboxesService } from 'apps/chatboxes/src/chatboxes.service';
import { ChatBox } from 'apps/chatboxes/src/schema/chatbox.schema';
import { Model } from 'mongoose';
import { UserInfo } from 'y/common/auth/user.decorator';
import { CreateMessage } from './dto/create.message.dto';
import { MessagesRepository } from './messages.repository';
import { Message } from './schema/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    // @InjectModel(Customer.name) private customerModel: Model<Customer>,
    // @InjectModel(ChatBox.name) private chatboxModel: Model<ChatBox>,
    // @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly chatboxRepository: ChatboxesRepository,
    private readonly messageRepository: MessagesRepository,
    private readonly chatboxesService: ChatboxesService,
  ) {}
  async createMessage(
    sender: UserInfo,
    receiver: string,
    content: CreateMessage,
  ): Promise<Message> {
    if (sender.role === 'Customer') {
      const message = await this.messageRepository.create({
        sendToCustomer: receiver,
        sendFromCustomer: sender.id,
        content: content.content,
      });
      const chatBoxSender = await this.chatboxRepository.findOne({
        ownerCustomer: sender.id,
        receiverCustomer: receiver,
      });
      const chatBoxReceiver = await this.chatboxRepository.findOne({
        ownerCustomer: receiver,
        receiverCustomer: sender.id,
      });
      if (!chatBoxSender || !chatBoxReceiver) {
        await this.chatboxesService.createChatBox(
          sender,
          receiver,
          message._id.toString(),
        );
      } else {
        console.log(chatBoxSender, chatBoxReceiver);
      }
      return message;
    }
  }

  async deleteMessage(
    user: UserInfo,
    messageId: string,
  ): Promise<{ msg: string }> {
    if (user.role === 'Customer') {
      const message = await this.messageRepository.findOne({ _id: messageId });
      if (!message) {
        throw new NotFoundException('Not found message');
      }
      if (message.sendFromCustomer.toString() !== user.id) {
        throw new BadRequestException('Not the owner Message ');
      }
      await this.messageRepository.delete({ _id: message._id });
      return { msg: 'delete successfully' };
    }
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
