import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Customer } from '../../customer/schema/customer.schema';
import { Driver } from '../../driver/schema/driver.schema';
import { AbstractDocument } from 'y/common';
import { CapacityVehicle } from 'utils/enum';
import { Hotline } from '../../hotline/schema/hotline.schema';

@Schema({ timestamps: true, versionKey: false })
export class Trip extends AbstractDocument {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Driver' })
  driver: Driver;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hotline' })
  hotline: Hotline;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  lat: number;

  @Prop()
  long: number;

  @Prop()
  vehicleType: number;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
