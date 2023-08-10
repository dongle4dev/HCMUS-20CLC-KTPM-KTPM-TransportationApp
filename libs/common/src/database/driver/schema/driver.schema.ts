import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Gender, Role, StatusDriver } from 'utils/enum';
import { AbstractDocument } from 'y/common';

@Schema({ timestamps: true, versionKey: false })
export class Driver extends AbstractDocument {
  @Prop()
  username: string;

  @Prop({ unique: [true, 'Duplicate phone number entered'] })
  phone: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Gender.MALE, enum: [Gender, 'Please enter valid gender'] })
  gender: string;

  @Prop()
  dob: string;

  @Prop()
  address: string;

  @Prop({ default: false })
  blocked: boolean;

  @Prop({ default: 0 })
  rated: number;

  @Prop({ default: StatusDriver.NORMAL })
  status: string;

  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' })
  vehicleId: string; // id vehicle

  @Prop({ default: Role.DRIVER, enum: [Role, 'Please enter valid Role'] })
  role: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
