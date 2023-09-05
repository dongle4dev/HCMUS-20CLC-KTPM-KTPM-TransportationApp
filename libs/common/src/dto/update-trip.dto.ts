import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  Matches,
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { StatusTrip } from '../utils';

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  _id: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  phone: string;

  @IsOptional()
  @IsString()
  address_pickup: string;

  @IsOptional()
  @IsNumber()
  lat_pickup: number;

  @IsOptional()
  @IsNumber()
  long_pickup: number;

  @IsNotEmpty()
  @IsString()
  address_destination: string;

  @IsOptional()
  @IsNumber()
  lat_destination: number;

  @IsOptional()
  @IsNumber()
  long_destination: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  distance: number;

  @IsNotEmpty()
  @IsNumber()
  vehicleType: number;

  @IsOptional()
  @IsEnum(StatusTrip)
  status: string;

  @IsString()
  @IsOptional()
  hotline: string;

  @IsString()
  @IsOptional()
  driver: string;

  @IsString()
  @IsOptional()
  customer: string;
}
