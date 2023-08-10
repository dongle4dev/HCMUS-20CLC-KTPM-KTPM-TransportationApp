import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'y/common';

@Schema({ timestamps: true, versionKey: false })
export class Demand extends AbstractDocument {}

export const DemandSchema = SchemaFactory.createForClass(Demand);
