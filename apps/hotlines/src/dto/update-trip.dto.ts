import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTripLocationDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
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
}
