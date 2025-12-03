import { Transform } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';
import parsePhoneNumberFromString from 'libphonenumber-js';

export class CreateBlackListDto {
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
}
