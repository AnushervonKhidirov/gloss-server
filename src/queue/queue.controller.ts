import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { QueueService } from './queue.service';

import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { Prisma } from 'generated/prisma/client';

const queueIncludes: Prisma.QueueInclude = {
  client: true,
  service: true,
  user: {
    omit: {
      username: true,
      password: true,
      role: true,
      archived: true,
    },
  },
};

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [queue, err] = await this.queueService.findOne({ id }, queueIncludes);
    if (err) throw err;
    return queue;
  }

  @Get()
  async findMany() {
    const [queues, err] = await this.queueService.findMany(
      undefined,
      queueIncludes,
    );
    if (err) throw err;
    return queues;
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) data: CreateQueueDto,
  ) {
    const [queue, err] = await this.queueService.create(data, queueIncludes);
    if (err) throw err;
    return queue;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) data: UpdateQueueDto,
  ) {
    const [queue, err] = await this.queueService.update(
      { id },
      data,
      queueIncludes,
    );
    if (err) throw err;
    return queue;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [queue, err] = await this.queueService.delete({ id }, queueIncludes);
    if (err) throw err;
    return queue;
  }
}
