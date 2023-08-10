import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DriverPositionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

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
}
