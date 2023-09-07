import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { StatusDriver } from 'y/common/utils/enum';

export class UpdateStatusDriverDto {
  @IsString()
  readonly id: string;

  @IsEnum(StatusDriver)
  readonly status?: string;
}
