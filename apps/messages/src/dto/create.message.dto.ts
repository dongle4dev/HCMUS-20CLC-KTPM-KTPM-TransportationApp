import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  customer_send: string;

  @IsOptional()
  @IsString()
  driver_receive: string;

  @IsOptional()
  @IsString()
  driver_send: string;

  @IsOptional()
  @IsString()
  customer_receive: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
