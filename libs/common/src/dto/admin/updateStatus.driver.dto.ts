import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDriverDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  blocked: boolean;
}
