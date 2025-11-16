import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  @ValidateIf(({ lastName }) => lastName !== undefined)
  lastName?: string;
}
