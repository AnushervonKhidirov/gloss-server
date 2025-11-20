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
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

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

  @UseGuards(AuthGuard)
  @Post('worker')
  async createWorkerService(
    @Req() request: Request,
    @Body(new ValidationPipe({ transform: true }))
    data: CreateWorkerServiceDto,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();
    if (+userPayload.sub !== data.userId) throw new ForbiddenException();

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
