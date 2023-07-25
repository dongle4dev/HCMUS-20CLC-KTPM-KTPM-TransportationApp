import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatboxService } from 'apps/chatbox/src/chatbox.service';
import { ChatBox } from 'apps/chatbox/src/schema/chatbox.schema';
import { Customer } from 'apps/customer/src/schema/customer.schema';
import { Model } from 'mongoose';
import { UserInfo } from 'y/common/auth/user.decorator';
import { CreateMessage } from './dto/create.message.dto';
import { Message } from './schema/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(ChatBox.name) private chatboxModel: Model<ChatBox>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly chatboxService: ChatboxService,
  ) {}
  async createMessage(
    sender: UserInfo,
    receiver: string,
    content: CreateMessage,
  ): Promise<Message> {
    if (sender.role === 'Customer') {
      const message = await this.messageModel.create({
        sendToCustomer: receiver,
        sendFromCustomer: sender.id,
        content: content.content,
      });
      const chatBoxSender = await this.chatboxModel
        .findOne({
          ownerCustomer: sender.id,
          receiverCustomer: receiver,
        })
        .exec();
      const chatBoxReceiver = await this.chatboxModel
        .findOne({
          ownerCustomer: receiver,
          receiverCustomer: sender.id,
        })
        .exec();
      if (!chatBoxSender || !chatBoxReceiver) {
        await this.chatboxService.createChatBox(sender, receiver, message._id);
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
      const message = await this.messageModel.findById({ _id: messageId });
      if (!message) {
        throw new NotFoundException('Not found message');
      }
      if (message.sendFromCustomer.toString() !== user.id) {
        throw new BadRequestException('Not the owner Message ');
      }
      await this.messageModel.findByIdAndRemove({ _id: message._id });
      return { msg: 'delete successfully' };
    }
  }

  async getAllMessage(): Promise<Message[]> {
    return this.messageModel.find();
  }
}
