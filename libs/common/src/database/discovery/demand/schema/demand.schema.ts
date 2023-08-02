import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'y/common';

@Schema({ versionKey: false })
export class Demand extends AbstractDocument {}

export const DemandSchema = SchemaFactory.createForClass(Demand);
