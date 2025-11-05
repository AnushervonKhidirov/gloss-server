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
import { WorkerService } from './worker.service';

import { FindQueryWorkerDto } from './dto/find-query-worker.dto';
import { FindQueryWorkerServicePriceDto } from './dto/find-query-worker-service-price.dto';
import { CreateWorkerServicePriceDto } from './dto/create-worker-service-price.dto';

const fieldsToOmit: Prisma.UserOmit = {
  username: true,
  password: true,
  role: true,
  archived: true,
  createdAt: true,
  updatedAt: true,
};

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get('service')
  async findWorkerServicePrice(
    @Query(new ValidationPipe({ transform: true }))
    { userId, serviceId }: FindQueryWorkerServicePriceDto,
  ) {
    const [service, err] = await this.workerService.findWorkerServicePrice({
      where: { userId, serviceId },
      include: {
        service: { omit: { createdAt: true, updatedAt: true } },
        user: { omit: fieldsToOmit },
      },
    });

    if (err) throw err;
    return service;
  }

  @Post('service')
  async createWorkerServicePrice(
    @Body(new ValidationPipe({ transform: true }))
    data: CreateWorkerServicePriceDto,
  ) {
    const [service, err] = await this.workerService.createWorkerServicePrice({
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
    const [user, err] = await this.workerService.findOne({
      where: { id },
      omit: fieldsToOmit,
      include: {
        categories: { omit: { createdAt: true, updatedAt: true } },
        queue: true,
      },
    });

    if (err) throw err;
    return user;
  }

  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true })) query: FindQueryWorkerDto,
  ) {
    const [users, err] = await this.workerService.findMany({
      where: { categories: { some: { id: query.categoryId } } },
      omit: fieldsToOmit,
      include: {
        categories: { omit: { createdAt: true, updatedAt: true } },
        queue: {
          where: {
            startAt: { gte: query.dateFrom },
            endAt: { lte: query.dateTo },
          },
        },
      },
    });

    if (err) throw err;
    return users;
  }
}
