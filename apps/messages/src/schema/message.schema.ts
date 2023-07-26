import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Customer } from 'apps/customers/src/schema/customer.schema';

import { Document, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Message extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  sendToCustomer: Customer;

  //   @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  //   sendToDriver: Driver;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  sendFromCustomer: Customer;

  //   @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  //   sendFromDriver: Driver;

  @Prop()
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
