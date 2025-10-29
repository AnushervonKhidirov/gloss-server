import { Transform } from 'class-transformer';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { IsPhoneNumber, IsString, IsNotEmpty } from 'class-validator';
import { Client } from 'generated/prisma';

export class CreateClientDto {
  @IsPhoneNumber('TJ')
  @Transform(({ obj }: { obj: Client }) => {
    const formattedNumber = parsePhoneNumberFromString(
      obj.phone,
      'TJ',
    )?.number.toString();

    obj.phone = formattedNumber ?? obj.phone;
    return obj.phone;
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
