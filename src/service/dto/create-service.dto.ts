import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  desc?: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  categoryId: number;
}
