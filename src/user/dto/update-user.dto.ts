import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  @ValidateIf(({ firstName }) => firstName !== undefined)
  firstName?: string;

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  @ValidateIf(({ lastName }) => lastName !== undefined)
  lastName?: string;
}
