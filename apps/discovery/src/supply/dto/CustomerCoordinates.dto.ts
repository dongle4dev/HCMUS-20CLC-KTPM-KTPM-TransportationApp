import { IsNumber } from 'class-validator';

export class CustomerCoordinates {
  @IsNumber()
  lat: number; // Latitude (vĩ do)

  @IsNumber()
  lng: number; // Longitude (kinh độ)
}
