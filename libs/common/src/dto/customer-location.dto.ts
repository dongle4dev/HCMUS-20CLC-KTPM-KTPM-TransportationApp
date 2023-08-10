import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CustomerPositionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  readonly phone?: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number; // Latitude (vĩ độ)

  @IsNumber()
  @IsNotEmpty()
  longitude: number; // Longitude (kinh độ)

  @IsOptional()
  @IsDate()
  day?: Date;

  constructor() {
    this.day = new Date(); // Set the default value to the current date.
  }

  @IsNumber()
  broadcastRadius: number;
}
