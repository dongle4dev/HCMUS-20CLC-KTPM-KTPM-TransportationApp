import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsArray()
  reasons: Array<string>;

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
