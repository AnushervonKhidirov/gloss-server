import type { Prisma } from 'generated/prisma/client';

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';

import { CreateWorkerServicePriceDto } from './dto/create-worker-service-price.dto';
import { FindQueryWorkerServicePriceDto } from './dto/find-query-worker-service-price.dto';

const fieldsToOmit: Prisma.UserOmit = {
  username: true,
  password: true,
  role: true,
  archived: true,
  createdAt: true,
  updatedAt: true,
};

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('worker')
  async findWorkerServicePrice(
    @Query(new ValidationPipe({ transform: true }))
    { userId, serviceId }: FindQueryWorkerServicePriceDto,
  ) {
    const [service, err] = await this.serviceService.findWorkerServicePrice({
      where: { userId, serviceId },
      include: {
        service: { omit: { createdAt: true, updatedAt: true } },
        user: { omit: fieldsToOmit },
      },
    });

    if (err) throw err;
    return service;
  }

  @Post('worker')
  async createWorkerServicePrice(
    @Body(new ValidationPipe({ transform: true }))
    data: CreateWorkerServicePriceDto,
  ) {
    const [service, err] = await this.serviceService.createWorkerServicePrice({
      data,
      include: {
        service: { omit: { createdAt: true, updatedAt: true } },
        user: { omit: fieldsToOmit },
      },
    });

    if (err) throw err;
    return service;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [service, err] = await this.serviceService.findOne({
      where: { id },
      include: { category: { omit: { createdAt: true, updatedAt: true } } },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return service;
  }

  @Get()
  async findMany() {
    const [services, err] = await this.serviceService.findMany({
      include: { category: { omit: { createdAt: true, updatedAt: true } } },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return services;
  }
}
