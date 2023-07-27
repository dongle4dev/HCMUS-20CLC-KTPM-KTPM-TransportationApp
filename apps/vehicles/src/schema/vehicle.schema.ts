import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from 'apps/admins/src/schema/admin.schema';
import { Customer } from 'apps/customers/src/schema/customer.schema';
import { Document, SchemaTypes } from 'mongoose';
import { CapacityVehicle } from 'utils/enum';
import { AbstractDocument } from 'y/common';

@Schema({
  timestamps: true,
})
export class Vehicle extends AbstractDocument {
  @Prop({ unique: true })
  licensePlate: string;

  @Prop({ enum: [CapacityVehicle, 'Please enter valid Vehicle Type'] })
  capacity: number;

  // @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  @Prop()
  owner: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
