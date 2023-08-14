import { IsEmpty, IsNotEmpty, IsNumber, Matches, IsString, IsOptional, IsMongoId } from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';

export class UpdateTripDto {
  @IsNotEmpty()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  vehicleType: number;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  long: number;

  @IsMongoId()
  @IsOptional()
  hotline: Hotline;

  @IsMongoId()
  @IsOptional()
  driver: Driver;

  @IsMongoId()
  @IsOptional()
  customer: Customer;
}
