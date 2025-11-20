import { Transform } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsPhoneNumber('TJ')
  @Transform(({ obj }) => {
    const formattedNumber = parsePhoneNumberFromString(
      obj.phone,
      'TJ',
    )?.number.toString();

    obj.phone = formattedNumber ?? obj.phone;
    return obj.phone;
  })
  phone: string;

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  @IsNotEmpty()
  lastName?: string;
}
