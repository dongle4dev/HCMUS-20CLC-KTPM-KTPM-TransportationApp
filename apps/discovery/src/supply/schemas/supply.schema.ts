import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'y/common';

@Schema({ versionKey: false })
export class Supply extends AbstractDocument {}

export const SupplySchema = SchemaFactory.createForClass(Supply);
