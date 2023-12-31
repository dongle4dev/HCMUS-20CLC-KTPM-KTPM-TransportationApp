import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { AbstractDocument } from 'y/common';
import { CapacityVehicle, StatusTrip } from 'y/common/utils/enum';
import { Customer } from '../../customer/schema/customer.schema';
import { Driver } from '../../driver/schema/driver.schema';
import { Hotline } from '../../hotline/schema/hotline.schema';

@Schema({ timestamps: true, versionKey: false })
export class Trip extends AbstractDocument {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Driver' })
  driver: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hotline' })
  hotline: string;

  @Prop()
  phone: string;

  @Prop()
  address_pickup: string;

  @Prop()
  lat_pickup: number;

  @Prop()
  long_pickup: number;

  @Prop()
  address_destination: string;

  @Prop()
  lat_destination: number;

  @Prop()
  long_destination: number;

  @Prop()
  price: number;

  @Prop({ default: 0 })
  surcharge: number;

  @Prop()
  distance: number;

  @Prop({
    default: StatusTrip.PENDING,
    enum: [StatusTrip, 'Please enter valid status trip'],
  })
  status: string;

  @Prop()
  vehicleType: number;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
