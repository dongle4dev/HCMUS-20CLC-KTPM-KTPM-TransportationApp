import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsDate()
  time: Date;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
  constructor() {
    this.time = new Date();
  }
}
