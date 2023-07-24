import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from 'apps/admin/src/schema/admin.schema';
import { Customer } from 'apps/customer/src/schema/customer.schema';
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