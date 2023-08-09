import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Gender, Role } from 'utils/enum';
import { AbstractDocument } from 'y/common';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Admin extends AbstractDocument {
  @Prop()
  username: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Gender.MALE, enum: [Gender, 'Please enter valid gender'] })
  gender: string;

  @Prop({ default: Role.ADMIN, enum: [Role, 'Please enter valid Role'] })
  role: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);