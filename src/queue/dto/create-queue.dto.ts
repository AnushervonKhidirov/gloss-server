import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreateQueueDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  userId: number;

  @IsNumber()
  clientId: number;

  @IsNumber()
  serviceId: number;
}
