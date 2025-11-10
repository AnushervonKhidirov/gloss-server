import { IsNumber } from 'class-validator';

export class CreateWorkerServiceDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  serviceId: number;

  @IsNumber()
  price: number;
}
