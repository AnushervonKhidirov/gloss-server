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
  Req,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'generated/prisma/client';

import { QueueService } from './queue.service';

import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import {
  FindQueryQueueDto,
  FindMyQueryQueueDto,
} from './dto/find-query-queue.dto';

const queueIncludes = (serviceId?: number): Prisma.QueueInclude => ({
  client: { omit: { createdAt: true, updatedAt: true } },
  service: { omit: { createdAt: true, updatedAt: true } },
  user: {
    include: {
      workerService: {
        where: { serviceId },
        select: { serviceId: true, price: true },
      },
    },
    omit: {
      username: true,
      password: true,
      role: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
    },
  },
});

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @UseGuards(AuthGuard)
  @Get('my')
  async findMyQueue(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    { clientId, serviceId, fromDate }: FindMyQueryQueueDto,
  ) {
    const userPayload: UserTokenPayload = request['user'];

    const [queues, err] = await this.queueService.findMany({
      where: {
        userId: +userPayload.sub,
        clientId: clientId,
        serviceId: serviceId,
        startAt: { gte: fromDate },
      },
      include: queueIncludes(serviceId),
    });
    if (err) throw err;
    return queues;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [queue, err] = await this.queueService.findOne({
      where: { id },
      include: queueIncludes(),
    });

    if (err) throw err;
    return queue;
  }

  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true }))
    { userId, exceptUserId, clientId, serviceId, fromDate }: FindQueryQueueDto,
  ) {
    const [queues, err] = await this.queueService.findMany({
      where: {
        userId: { equals: userId, not: exceptUserId },
        clientId: clientId,
        serviceId: serviceId,
        startAt: { gte: fromDate },
      },
      include: queueIncludes(serviceId),
    });
    if (err) throw err;
    return queues;
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) data: CreateQueueDto,
  ) {
    const [queue, err] = await this.queueService.create({
      data,
      include: queueIncludes(),
    });
    if (err) throw err;
    return queue;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) data: UpdateQueueDto,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload = request['user'];
    const userId =
      userPayload.role !== Role.ADMIN ? +userPayload.sub : undefined;

    const [queue, err] = await this.queueService.update({
      where: { id, userId },
      data,
      include: queueIncludes(),
    });
    if (err) throw err;
    return queue;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userPayload: UserTokenPayload = request['user'];
    const userId =
      userPayload.role !== Role.ADMIN ? +userPayload.sub : undefined;

    const [queue, err] = await this.queueService.delete({
      where: { id, userId },
      include: queueIncludes(),
    });
    if (err) throw err;
    return queue;
  }
}
