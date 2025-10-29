import { Transform } from 'class-transformer';
import { IsPhoneNumber, IsString, IsNotEmpty } from 'class-validator';
import { Client } from 'generated/prisma';

export class CreateClientDto {
  @IsPhoneNumber('TJ')
  @Transform(({ obj }: { obj: Client }) => {
    obj.phone = obj.phone.replaceAll(' ', '');
    return obj.phone;
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
