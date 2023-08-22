import { IsNotEmpty, IsString } from 'class-validator';

export class TripInfoDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  customer: string;
}
