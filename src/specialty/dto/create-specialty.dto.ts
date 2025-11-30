import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  desc?: string;
}
