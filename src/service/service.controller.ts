import type { Prisma } from 'generated/prisma/client';
import type { UserTokenPayload } from 'src/token/type/token.type';

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
  UseGuards,
  Req,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

import { ServiceService } from './service.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { WorkerServiceDto } from './dto/worker-service-price.dto';
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

  @UseGuards(AuthGuard)
  @Get('worker/my')
  async findMyServices(@Req() request: Request) {
    const userPayload: UserTokenPayload = request['user'];

    const [service, err] = await this.serviceService.findWorkerServices({
      where: { userId: +userPayload.sub },
      include: {
        service: {
          omit: { createdAt: true, updatedAt: true },
          include: { category: { omit: { createdAt: true, updatedAt: true } } },
        },
      },
    });

    if (err) throw err;
    return service;
  }

  @UseGuards(AuthGuard)
  @Get('worker')
  async findWorkerServices(
    @Query(new ValidationPipe({ transform: true }))
    { userId, serviceId }: FindQueryWorkerServiceDto,
  ) {
    const [service, err] = await this.serviceService.findWorkerServices({
      where: { userId, serviceId },
      include: {
        service: {
          omit: { createdAt: true, updatedAt: true },
          include: { category: { omit: { createdAt: true, updatedAt: true } } },
        },
      },
    });

    if (err) throw err;
    return service;
  }

  @UseGuards(AuthGuard)
  @Post('worker')
  async workerServiceHandler(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true }))
    data: WorkerServiceDto[],
  ) {
    const userPayload: UserTokenPayload = request['user'];

    const [services, err] = await this.serviceService.workerServiceHandler({
      userId: +userPayload.sub,
      data,
      include: {
        service: {
          omit: { createdAt: true, updatedAt: true },
          include: { category: { omit: { createdAt: true, updatedAt: true } } },
        },
      },
    });

    if (err) throw err;
    return services;
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

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
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

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateServiceDto,
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

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [services, err] = await this.serviceService.delete({ where: { id } });
    if (err) throw err;
    return services;
  }
}
