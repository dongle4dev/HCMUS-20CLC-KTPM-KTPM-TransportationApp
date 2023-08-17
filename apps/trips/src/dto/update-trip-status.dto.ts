import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StatusTrip } from 'utils/enum';

export class UpdateTripStatusDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(StatusTrip)
  status: string;
}
