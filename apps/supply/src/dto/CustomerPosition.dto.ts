import { IsNumber } from 'class-validator';

export class CustomerPositionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  lat: number; // Latitude (vĩ độ)

  @IsNumber()
  lng: number; // Longitude (kinh độ)
}
