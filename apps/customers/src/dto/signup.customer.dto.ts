import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { CustomerType, Gender, Role } from 'y/common/utils/enum';

export class SignUpCustomerDto {
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
  blocked: false;

  @IsEmpty()
  customerType: CustomerType.REGULAR;

  @IsEmpty()
  role: Role.CUSTOMER;
}
