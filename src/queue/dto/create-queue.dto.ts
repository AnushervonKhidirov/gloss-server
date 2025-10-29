import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreateQueueDto {
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @IsNumber()
  userId: number;

  @IsNumber()
  clientId: number;

  @IsNumber()
  serviceId: number;
}
