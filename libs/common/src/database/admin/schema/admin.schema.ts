import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AbstractDocument } from 'y/common';
import { Gender, Role } from 'y/common/utils/enum';

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
