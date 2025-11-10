import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class FindQueryWorkerDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateFrom?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTo?: Date;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  serviceId?: number;
}
