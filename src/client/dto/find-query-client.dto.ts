import { Transform, Type } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {
  IsPhoneNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsBooleanString,
} from 'class-validator';

export class FindQueryClientDto {
  @IsPhoneNumber('TJ')
  @IsOptional()
  @Transform(({ value }) => {
    const formattedNumber = parsePhoneNumberFromString(
      value,
      'TJ',
    )?.number.toString();

    value = formattedNumber ?? value;
    return value;
  })
  phone?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  exceptBlackList: boolean;
}
