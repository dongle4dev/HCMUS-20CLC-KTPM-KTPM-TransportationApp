import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  Matches,
  IsString,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { Trip } from 'y/common/database/trip/schema/trip.schema';

export class TrackingTripDto {
  @IsNotEmpty()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  vehicleType: number;

  @IsOptional()
  @IsNumber()
  lat: number;

  @IsOptional()
  @IsNumber()
  long: number;

  @IsMongoId()
  @IsOptional()
  trip: Trip;
}
