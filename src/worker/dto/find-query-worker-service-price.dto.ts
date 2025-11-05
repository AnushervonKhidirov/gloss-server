import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindQueryWorkerServicePriceDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  serviceId?: number;
}
