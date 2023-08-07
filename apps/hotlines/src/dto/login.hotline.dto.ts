import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class LoginHotlineDto {
  // @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email?: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  readonly phone?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
