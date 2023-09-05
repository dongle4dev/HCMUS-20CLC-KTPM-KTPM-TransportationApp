import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CapacityVehicle } from 'y/common/utils/enum';

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  driver: string;

  @IsNotEmpty()
  @IsString()
  readonly licensePlate: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(CapacityVehicle)
  readonly capacity: number;
}
