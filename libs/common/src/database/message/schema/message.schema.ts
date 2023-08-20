import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { Document, SchemaTypes } from 'mongoose';
import { AbstractDocument } from 'y/common';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Message extends AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  customer_send: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  driver_receive: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  driver_send: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  customer_receive: string;

  @Prop()
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
