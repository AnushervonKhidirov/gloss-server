import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @MaxLength(40)
  @IsNotEmpty()
  lastName?: string;

  @IsNumber()
  @IsOptional()
  specialtyId?: number;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}
