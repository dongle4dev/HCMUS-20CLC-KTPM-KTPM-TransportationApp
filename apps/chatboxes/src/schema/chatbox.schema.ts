import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Message } from 'apps/messages/src/schema/message.schema';
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

  @Prop({ unique: true })
  idUnique: string;

  @Prop({ default: [], type: [{ type: SchemaTypes.ObjectId, ref: 'Message' }] })
  messageList: Message[];
}

export const ChatBoxSchema = SchemaFactory.createForClass(ChatBox);
