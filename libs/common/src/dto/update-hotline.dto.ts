import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Gender } from 'y/common/utils/enum';

export class UpdateHotlineDto {
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  // @MinLength(6)
  readonly password?: string;

  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  readonly gender?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly dob?: string;
}
