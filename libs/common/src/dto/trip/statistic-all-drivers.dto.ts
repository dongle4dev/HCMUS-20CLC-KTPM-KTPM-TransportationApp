// calculate-price.dto.ts
import { IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class StatisticAllDriversDto {
  @IsOptional()
  @IsArray()
  drivers: Array<any>;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
