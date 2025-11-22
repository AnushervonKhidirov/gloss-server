import { IsNumber, IsOptional } from 'class-validator';

export class WorkerServiceDto {
  @IsNumber()
  serviceId: number;

  @IsNumber()
  @IsOptional()
  price?: number;
}
