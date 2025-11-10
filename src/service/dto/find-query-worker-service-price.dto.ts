import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindQueryWorkerServiceDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  serviceId?: number;
}
