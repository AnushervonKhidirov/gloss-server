import { IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindMyQueryQueueDto {
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
  fromDate?: Date;
}

export class FindQueryQueueDto extends FindMyQueryQueueDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  exceptUserId?: number;
}
