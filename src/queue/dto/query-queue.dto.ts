import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryQueueDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  clientId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  serviceId?: number;
}
