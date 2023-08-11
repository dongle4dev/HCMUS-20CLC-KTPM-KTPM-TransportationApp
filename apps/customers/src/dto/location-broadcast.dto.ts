import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class LocationBroadcastFromCustomerDto {
  @IsNumber()
  latitude: number; // Latitude (vĩ độ)

  @IsNumber()
  longitude: number; // Longitude (kinh độ)

  @IsString()
  @IsNotEmpty()
  arrivalAddress: string; // điểm đến của khách hàng

  @IsOptional()
  @IsDate()
  day?: Date;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  readonly phone?: string;

  @IsNumber()
  broadcastRadius: number;
  constructor() {
    this.day = new Date(); // Set the default value to the current date.
  }
}
