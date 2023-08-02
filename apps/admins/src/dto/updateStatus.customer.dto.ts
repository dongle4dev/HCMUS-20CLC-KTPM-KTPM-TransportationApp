import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusCustomerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  blocked: boolean;
}
