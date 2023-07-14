import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmpty,
} from 'class-validator';

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
}