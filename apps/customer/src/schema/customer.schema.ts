import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { CustomerType, Gender, Role } from 'utils/enum';

@Schema({
  timestamps: true,
})
export class Customer extends Document {
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

  @Prop({
    default: CustomerType.REGULAR,
    enum: [CustomerType, 'Please enter valid customerType'],
  })
  customerType: string;

  @Prop({ default: Role.CUSTOMER, enum: [Role, 'Please enter valid Role'] })
  role: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' })
  // vehicleType: mongoose.Types.ObjectId;

  // @Prop([{ type: BillSchema }])
  // billList: Bill[];

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }] })
  // billList: Bill[];

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }] })
  // billList: Contact[];

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }] })
  // billList: Bill[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // user: User;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
