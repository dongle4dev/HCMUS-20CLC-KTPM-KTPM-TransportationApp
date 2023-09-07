import { IsNotEmpty, IsNumber } from 'class-validator';

export class CalculateTripRedisDto {
  @IsNotEmpty()
  @IsNumber()
  bike_basePrice: number;

  @IsNotEmpty()
  @IsNumber()
  car_basePrice: number;

  @IsNotEmpty()
  @IsNumber()
  van_basePrice: number;

  @IsNotEmpty()
  @IsNumber()
  bike_upTo10Km: number;

  @IsNotEmpty()
  @IsNumber()
  bike_after10Km: number;

  @IsNotEmpty()
  @IsNumber()
  car_upTo10Km: number;

  @IsNotEmpty()
  @IsNumber()
  car_after10Km: number;

  @IsNotEmpty()
  @IsNumber()
  van_upTo10Km: number;

  @IsNotEmpty()
  @IsNumber()
  van_after10Km: number;

  @IsNotEmpty()
  @IsNumber()
  startTimePeakHour: number;
  @IsNotEmpty()
  @IsNumber()
  endTimePeakHour: number;
  @IsNotEmpty()
  @IsNumber()
  surchargeIndexLevel1: number;
  @IsNotEmpty()
  @IsNumber()
  surchargeIndexLevel2: number;
}
