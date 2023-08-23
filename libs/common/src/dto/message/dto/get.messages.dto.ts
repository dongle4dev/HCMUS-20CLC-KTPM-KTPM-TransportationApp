import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetMessagesDto {
  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsString()
  driver: string;
}
