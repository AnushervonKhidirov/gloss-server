import { IsNumber } from 'class-validator';

export class CreateWorkerServicePriceDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  serviceId: number;

  @IsNumber()
  price: number;
}
