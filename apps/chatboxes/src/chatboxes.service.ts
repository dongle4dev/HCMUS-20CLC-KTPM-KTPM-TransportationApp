import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from 'apps/customers/src/schema/customer.schema';
import { Message } from 'apps/messages/src/schema/message.schema';
import { Model } from 'mongoose';
import { UserInfo } from 'y/common/auth/user.decorator';
import { ChatBox } from './schema/chatbox.schema';

@Injectable()
export class ChatboxesService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(ChatBox.name) private chatBoxModel: Model<ChatBox>,
  ) {}

  async createChatBox(
    sender: UserInfo,
    receiver: string,
    msg?: string,
  ): Promise<{ msg: string }> {
    if (sender.role === 'Customer') {
      const senderName = (await this.customerModel.findById({ _id: sender.id }))
        .username;
      const receiverName = (
        await this.customerModel.findById({
          _id: receiver,
        })
      ).username;
      // const messages = [];
      // messages.push(msg);
      // console.log(messages);
      // tạo cho người gửi
      try {
        await this.chatBoxModel.create({
          ownerCustomer: sender.id,
          ownerName: senderName,
          receiverCustomer: receiver,
          receiverName: receiverName,
          idUnique: sender.id.concat(receiver),
          // messageList: msg ? [...messages] : [],
        });
        //tạo cho người nhận
        await this.chatBoxModel.create({
          ownerCustomer: receiver,
          ownerName: receiverName,
          receiverCustomer: sender.id,
          receiverName: senderName,
          idUnique: receiver.concat(sender.id),
          // messageList: msg ? [...messages] : [],
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
    const chatBox = await this.chatBoxModel.findById({
      _id: chatBoxId,
    });
    if (!chatBox) {
      throw new BadRequestException('The chat box is not exist');
    }
    if (owner.role === 'Customer') {
      if (chatBox.ownerCustomer.toString() === owner.id) {
        await this.chatBoxModel.findByIdAndRemove({
          _id: chatBoxId,
        });
        return { msg: 'Success' };
      } else {
        throw new BadRequestException('You are not the owner');
      }
    }
  }

  async getAllUserChatBox(user: UserInfo): Promise<ChatBox[]> {
    const chatboxList = await this.chatBoxModel.find({
      ownerCustomer: user.id,
    });
    if (!chatboxList) {
      throw new NotFoundException('User does not have any chat box');
    }
    return chatboxList;
  }
  async getAllChatBox() {
    return this.chatBoxModel.find().exec();
  }

  async deleteAllChatBox(): Promise<{ msg: string; deletedCount: number }> {
    try {
      // Assuming this.chatBoxModel is a valid Mongoose model
      const result = await this.chatBoxModel.deleteMany({}); // Pass an empty object as the filter
      return { msg: 'Deleted All', deletedCount: result.deletedCount };
    } catch (error) {
      // Handle any errors that might occur during the deletion process
      console.error('Error deleting chat boxes:', error);
      throw error; // Rethrow the error or handle it according to your needs
    }
  }
}
