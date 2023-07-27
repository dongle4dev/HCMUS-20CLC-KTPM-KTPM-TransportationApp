import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import { Role } from 'utils/enum';

export class SignUpAdminDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsEmpty()
  role: Role.ADMIN;
}
