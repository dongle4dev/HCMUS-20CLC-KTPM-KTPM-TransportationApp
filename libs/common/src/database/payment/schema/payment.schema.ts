import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'y/common';
import { Schema as MongooseSchema } from 'mongoose';
@Schema({ timestamps: true, versionKey: false })
export class Payment extends AbstractDocument {
  @Prop()
  totalPrice: number;

  @Prop()
  surcharge: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: string; // chỉ chứa id của customer

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Driver' })
  driver: string; // chỉ chứa id của driver

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Trip' })
  trip: string; // chỉ chứa id của trip
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
