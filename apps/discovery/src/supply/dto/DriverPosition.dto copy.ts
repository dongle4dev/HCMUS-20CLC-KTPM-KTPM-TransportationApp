import { IsNumber } from 'class-validator';

export class DriverPositionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  lat: number; // Latitude (vĩ độ)

  @IsNumber()
  lng: number; // Longitude (kinh độ)
}
