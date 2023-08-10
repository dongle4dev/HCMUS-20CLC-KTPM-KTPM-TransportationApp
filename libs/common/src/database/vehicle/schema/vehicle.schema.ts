import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CapacityVehicle } from 'utils/enum';
import { AbstractDocument } from 'y/common';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Vehicle extends AbstractDocument {
  @Prop({ unique: true })
  licensePlate: string;

  @Prop({ enum: [CapacityVehicle, 'Please enter valid Vehicle Type'] })
  capacity: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Driver' })
  @Prop()
  owner: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
