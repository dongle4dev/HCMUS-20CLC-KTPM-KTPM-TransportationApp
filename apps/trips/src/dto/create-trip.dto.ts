import { IsEmpty, IsNotEmpty, IsNumber, Matches, IsString } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  phone: string;

  @IsNotEmpty()
  @IsString()
  add: string;

  @IsEmpty()
  @IsNumber()
  vehicleType: number;
}
