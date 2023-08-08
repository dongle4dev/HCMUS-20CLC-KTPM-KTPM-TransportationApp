import { IsEmpty, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  readonly phone: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsEmpty()
  times: number;
}
