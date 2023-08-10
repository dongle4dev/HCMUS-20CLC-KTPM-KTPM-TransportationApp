import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LocationDto {
  @IsNumber()
  latitude: number; // Latitude (vĩ độ)

  @IsNumber()
  longitude: number; // Longitude (kinh độ)

  @IsOptional()
  @IsDate()
  day?: Date;

  constructor() {
    this.day = new Date(); // Set the default value to the current date.
  }
}
