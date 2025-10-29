import { IsDate, IsNumber } from 'class-validator';

export class CreateQueueDto {
  @IsDate()
  date: Date;

  @IsNumber()
  userId: number;

  @IsNumber()
  clientId: number;

  @IsNumber()
  serviceId: number;
}
