import {
  IsNotEmpty,
  IsOptional,
  IsString,
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
