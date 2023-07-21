import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from 'apps/admin/src/schema/admin.schema';
import { Customer } from 'apps/customer/src/schema/customer.schema';
import { Document, SchemaTypes } from 'mongoose';
import { CapacityVehicle } from 'utils/enum';

@Schema({
  timestamps: true,
})
export class Vehicle extends Document {
  @Prop({ unique: true })
  licensePlate: string;

  @Prop({ enum: [CapacityVehicle, 'Please enter valid Vehicle Type'] })
  capacity: number;

  // @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  @Prop()
  owner: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
