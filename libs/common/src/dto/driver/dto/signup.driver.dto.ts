import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Gender, Role, StatusDriver } from 'y/common/utils/enum';

export class SignUpDriverDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  readonly gender: string;

  @IsOptional()
  @IsString()
  readonly dob: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly OTP_token: string;

  @IsOptional()
  @IsNumber()
  readonly otp: number;

  @IsEmpty()
  rated: 0;

  @IsEmpty()
  vehicleId: null;

  @IsEmpty()
  blocked: false;

  @IsEmpty()
  status: StatusDriver.ACTIVE;

  @IsEmpty()
  role: Role.DRIVER;
}
