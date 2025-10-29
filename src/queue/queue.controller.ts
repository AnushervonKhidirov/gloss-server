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

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [queue, err] = await this.queueService.findOne({ id });
    if (err) throw err;
    return queue;
  }

  @Get()
  async findMany() {
    const [queues, err] = await this.queueService.findMany();
    if (err) throw err;
    return queues;
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) data: CreateQueueDto,
  ) {
    const [queue, err] = await this.queueService.create(data);
    if (err) throw err;
    return queue;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateQueueDto,
  ) {
    const [queue, err] = await this.queueService.update({ id }, data);
    if (err) throw err;
    return queue;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [queue, err] = await this.queueService.delete({ id });
    if (err) throw err;
    return queue;
  }
}
