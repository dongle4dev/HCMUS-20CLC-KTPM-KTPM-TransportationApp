import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomersRepository } from 'apps/customers/src/customers.repository';
import { Customer } from 'apps/customers/src/schema/customer.schema';
import { MessagesRepository } from 'apps/messages/src/messages.repository';
import { Message } from 'apps/messages/src/schema/message.schema';
import { Model } from 'mongoose';
import { UserInfo } from 'y/common/auth/user.decorator';
import { ChatboxesRepository } from './chatboxes.repository';
import { ChatBox } from './schema/chatbox.schema';

@Injectable()
export class ChatboxesService {
  constructor(
    // @InjectModel(Customer.name) private customerModel: Model<Customer>,
    // @InjectModel(Message.name) private messageModel: Model<Message>,
    // @InjectModel(ChatBox.name) private chatBoxModel: Model<ChatBox>,
    private readonly chatBoxRepository: ChatboxesRepository,
    private readonly customerRepository: CustomersRepository,
    private readonly messageRepository: MessagesRepository,
  ) {}

  async createChatBox(
    sender: UserInfo,
    receiver: string,
    msg?: string,
  ): Promise<{ msg: string }> {
    if (sender.role === 'Customer') {
      const senderUser = await this.customerRepository.findOne({
        _id: sender.id,
      });
      console.log(senderUser);
      const senderName = senderUser.username;
      const receiverName = (
        await this.customerRepository.findOne({
          _id: receiver,
        })
      ).username;
      const messages = [];
      messages.push(msg);
      console.log(messages);
      // tạo cho người gửi
      try {
        await this.chatBoxRepository.create({
          ownerCustomer: sender.id,
          ownerName: senderName,
          receiverCustomer: receiver,
          receiverName: receiverName,
          idUnique: sender.id.concat(receiver),
          messageList: msg ? [...messages] : [],
        });
        //tạo cho người nhận
        await this.chatBoxRepository.create({
          ownerCustomer: receiver,
          ownerName: receiverName,
          receiverCustomer: sender.id,
          receiverName: senderName,
          idUnique: receiver.concat(sender.id),
          messageList: msg ? [...messages] : [],
        });
        return { msg: 'Created' };
      } catch (e) {
        if (e.code === 11000) {
          throw new BadRequestException('Duplicated Prop');
        }
      }
    }
  }

  async deleteChatBox(
    owner: UserInfo,
    chatBoxId: string,
  ): Promise<{ msg: string }> {
    console.log(chatBoxId);
    const chatBox = await this.chatBoxRepository.findOne({
      _id: chatBoxId,
    });
    if (!chatBox) {
      throw new BadRequestException('The chat box is not exist');
    }
    if (owner.role === 'Customer') {
      if (chatBox.ownerCustomer.toString() === owner.id) {
        await this.chatBoxRepository.delete({
          _id: chatBoxId,
        });
        return { msg: 'Success' };
      } else {
        throw new BadRequestException('You are not the owner');
      }
    }
  }

  async getAllUserChatBox(user: UserInfo): Promise<ChatBox[]> {
    const chatboxList = await this.chatBoxRepository.find({
      ownerCustomer: user.id,
    });
    if (!chatboxList) {
      throw new NotFoundException('User does not have any chat box');
    }
    return chatboxList;
  }
  async getAllChatBox() {
    return this.chatBoxRepository.find({});
  }

  async deleteAllChatBox(): Promise<{ msg: string }> {
    try {
      // Assuming this.chatBoxRepository is a valid Mongoose model
      const result = await this.chatBoxRepository.deleteMany({}); // Pass an empty object as the filter
      return { msg: 'Deleted All' };
    } catch (error) {
      // Handle any errors that might occur during the deletion process
      console.error('Error deleting chat boxes:', error);
      throw error; // Rethrow the error or handle it according to your needs
    }
  }
}
