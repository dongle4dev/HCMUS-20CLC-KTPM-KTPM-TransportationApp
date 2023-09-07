import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CapacityVehicle } from 'y/common/utils';

export class CalculateTripPriceDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  distance: number;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(CapacityVehicle)
  mode: number;
}
