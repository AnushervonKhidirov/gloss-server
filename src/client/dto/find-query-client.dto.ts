import { Transform } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { IsPhoneNumber, IsString, IsOptional } from 'class-validator';
import { Client } from 'generated/prisma';

export class FindQueryClientDto {
  @IsPhoneNumber('TJ')
  @IsOptional()
  @Transform(({ obj }: { obj: Client }) => {
    const formattedNumber = parsePhoneNumberFromString(
      obj.phone,
      'TJ',
    )?.number.toString();

    obj.phone = formattedNumber ?? obj.phone;
    return obj.phone;
  })
  phone: string;

  @IsString()
  @IsOptional()
  name: string;
}
