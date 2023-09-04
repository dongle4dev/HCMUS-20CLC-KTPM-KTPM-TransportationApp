import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'y/common';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class NotificationToken extends AbstractDocument {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  user: string;

  @Prop()
  notification_token: string;
}

export const NotificationTokenSchema = SchemaFactory.createForClass(NotificationToken);
