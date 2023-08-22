import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractDocument } from 'y/common';
import { Gender } from 'y/common/utils/enum';

@Schema({ timestamps: true, versionKey: false })
export class Location extends AbstractDocument {
  @Prop()
  phone: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop({ default: 1 })
  times: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
