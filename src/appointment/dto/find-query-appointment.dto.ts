import { IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindMyQueryAppointmentDto {
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
}

export class FindQueryAppointmentDto extends FindMyQueryAppointmentDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  exceptUserId?: number;
}
