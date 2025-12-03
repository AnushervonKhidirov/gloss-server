import { IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindQueryAppointmentDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  clientId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  serviceId?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateFrom?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateTo?: Date;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  exceptUserId?: number;
}
