import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AbstractDocument } from 'y/common';
import { CapacityVehicle } from 'y/common/utils/enum';

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
  driver: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
