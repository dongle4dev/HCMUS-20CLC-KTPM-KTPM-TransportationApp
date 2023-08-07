import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'y/common';

@Schema({ timestamps: true, versionKey: false })
export class Supply extends AbstractDocument {}

export const SupplySchema = SchemaFactory.createForClass(Supply);
