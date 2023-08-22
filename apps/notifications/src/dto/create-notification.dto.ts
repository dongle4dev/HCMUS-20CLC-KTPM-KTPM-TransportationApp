import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  driver: string;

  @IsOptional()
  @IsString()
  trip: string;

  @IsOptional()
  @IsDate()
  time: Date;

  @IsOptional()
  @IsBoolean()
  read: boolean;
}
