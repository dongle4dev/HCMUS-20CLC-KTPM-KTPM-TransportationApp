import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class StorePositionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  lat: number; // Latitude (vĩ độ)

  @IsNumber()
  lng: number; // Longitude (kinh độ)

  @IsOptional()
  @IsDate()
  day?: Date;

  constructor() {
    this.day = new Date(); // Set the default value to the current date.
  }
}
