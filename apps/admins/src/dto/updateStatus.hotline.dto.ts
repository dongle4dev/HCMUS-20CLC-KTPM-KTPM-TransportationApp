import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusHotlineDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  blocked: boolean;
}
