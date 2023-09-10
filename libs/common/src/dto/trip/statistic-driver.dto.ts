// calculate-price.dto.ts
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class StatisticDriverDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
