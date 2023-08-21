import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedBackDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  driver: string;

  @IsOptional()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsString()
  trip: string;
}
