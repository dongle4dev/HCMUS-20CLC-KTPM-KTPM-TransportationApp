import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Gender, RatingNumber, Role } from 'utils/enum';
import { AbstractDocument } from 'y/common';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Notification extends AbstractDocument {
  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: string; // chỉ chứa id của customer

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Driver' })
  driver: string; // chỉ chứa id của driver

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Trip' })
  trip: string; // chỉ chứa id của trip

  @Prop({ deafult: Date.now() })
  time: Date;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
