import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
  IsEmpty,
} from 'class-validator';
import { Gender, Role, StatusDriver } from 'utils/enum';

export class SignUpDriverDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
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

  @IsEmpty()
  rated: 0;

  @IsEmpty()
  vehicleId: null;

  @IsEmpty()
  blocked: false;

  @IsEmpty()
  status: StatusDriver.NORMAL;

  @IsEmpty()
  role: Role.DRIVER;
}
