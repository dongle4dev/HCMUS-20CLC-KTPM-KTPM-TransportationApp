import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from 'apps/admin/src/schema/admin.schema';
import { Customer } from 'apps/customer/src/schema/customer.schema';
import { Message } from 'apps/message/src/schema/message.schema';
import mongoose, { Document, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ChatBox extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  ownerCustomer: string;

  //   @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  //   ownerDriver: Driver;
  @Prop()
  ownerName: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  receiverCustomer: string;
  //   @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  //   receiverDriver: Driver;

  @Prop()
  receiverName: string;

  @Prop({ default: [], type: [{ type: SchemaTypes.ObjectId, ref: 'Message' }] })
  messageList: Message[];
}

export const ChatBoxSchema = SchemaFactory.createForClass(ChatBox);
