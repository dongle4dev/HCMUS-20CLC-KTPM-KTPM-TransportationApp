import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CapacityVehicle } from 'y/common/utils/enum';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  readonly licensePlate: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(CapacityVehicle)
  readonly capacity: number;
}
