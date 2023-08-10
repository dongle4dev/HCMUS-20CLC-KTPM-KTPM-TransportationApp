import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Message } from 'apps/messages/src/schema/message.schema';
import mongoose, { Document, SchemaTypes } from 'mongoose';
import { AbstractDocument } from 'y/common';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Discovery extends AbstractDocument {}

export const DiscoverySchema = SchemaFactory.createForClass(Discovery);
