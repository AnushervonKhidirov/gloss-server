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
  ForbiddenException,
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
    { clientId, serviceId, dateFrom, dateTo }: FindMyQueryQueueDto,
  ) {
    const userPayload: UserTokenPayload = request['user'];

    const [queues, err] = await this.queueService.findMany({
      where: {
        userId: +userPayload.sub,
        clientId: clientId,
        serviceId: serviceId,
        startAt: { gte: dateFrom, lt: dateTo },
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
    {
      userId,
      exceptUserId,
      clientId,
      serviceId,
      dateFrom,
      dateTo,
    }: FindQueryQueueDto,
  ) {
    const [queues, err] = await this.queueService.findMany({
      where: {
        userId: { equals: userId, not: exceptUserId },
        clientId: clientId,
        serviceId: serviceId,
        startAt: { gte: dateFrom, lt: dateTo },
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
    const isAdmin = userPayload.role === Role.ADMIN;
    const userId = +userPayload.sub;

    const [queue, err] = await this.queueService.findOne({
      where: { id },
    });

    if (err) throw err;
    if (queue.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Только администратору разрешено редактировать чужую очередь',
      );
    }

    const [queueToUpdate, queueToUpdateErr] = await this.queueService.update({
      where: { id },
      data,
      include: queueIncludes(),
    });
    if (queueToUpdateErr) throw queueToUpdateErr;
    return queueToUpdate;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userPayload: UserTokenPayload = request['user'];

    const isAdmin = userPayload.role === Role.ADMIN;
    const userId = +userPayload.sub;
    const now = new Date();

    const [queue, err] = await this.queueService.findOne({
      where: { id },
    });

    if (err) throw err;

    if (queue.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Только администратору разрешено удалять чужую очередь',
      );
    }

    if (now >= queue.endAt && !isAdmin) {
      throw new ForbiddenException(
        'Только администратору разрешено удалять оконченные предоставленные услуги',
      );
    }

    const [queueToDelete, queueToDeleteErr] = await this.queueService.delete({
      where: { id },
      include: queueIncludes(),
    });
    if (queueToDeleteErr) throw queueToDeleteErr;
    return queueToDelete;
  }
}
