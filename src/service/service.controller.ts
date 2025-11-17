import type { Prisma } from 'generated/prisma/client';

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateWorkerServiceDto } from './dto/create-worker-service-price.dto';
import { FindQueryWorkerServiceDto } from './dto/find-query-worker-service-price.dto';

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
  async findWorkerService(
    @Query(new ValidationPipe({ transform: true }))
    { userId, serviceId }: FindQueryWorkerServiceDto,
  ) {
    const [service, err] = await this.serviceService.findWorkerService({
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
  async createWorkerService(
    @Body(new ValidationPipe({ transform: true }))
    data: CreateWorkerServiceDto,
  ) {
    const [service, err] = await this.serviceService.createWorkerService({
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

  @Post()
  async create(@Body(new ValidationPipe()) data: CreateServiceDto) {
    const [services, err] = await this.serviceService.create({
      data,
      include: { category: { omit: { createdAt: true, updatedAt: true } } },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return services;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: CreateServiceDto,
  ) {
    const [services, err] = await this.serviceService.update({
      where: { id },
      data,
      include: { category: { omit: { createdAt: true, updatedAt: true } } },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return services;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [services, err] = await this.serviceService.delete({ where: { id } });
    if (err) throw err;
    return services;
  }
}
