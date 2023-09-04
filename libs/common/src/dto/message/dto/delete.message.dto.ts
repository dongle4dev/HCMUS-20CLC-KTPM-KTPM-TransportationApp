import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMessagesDto {
  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsString()
  driver: string;
}
