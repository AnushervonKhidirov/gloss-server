import type { Prisma, Queue } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.QueueWhereUniqueInput,
  ): ReturnWithErrPromise<Queue> {
    try {
      const queue = await this.prisma.queue.findUnique({ where });
      if (!queue) throw new NotFoundException('Queue not found');
      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.QueueWhereInput,
  ): ReturnWithErrPromise<Queue[]> {
    try {
      const queue = await this.prisma.queue.findMany({ where });
      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(data: CreateQueueDto): ReturnWithErrPromise<Queue> {
    try {
      const queue = await this.prisma.queue.create({
        data: data,
        include: {
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
        },
      });

      if (!queue) {
        throw new InternalServerErrorException("Can't add to queue");
      }

      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.QueueWhereUniqueInput,
    data: UpdateQueueDto,
  ): ReturnWithErrPromise<Queue> {
    try {
      const queue = await this.prisma.queue.update({
        where,
        data,
        include: {
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
        },
      });

      if (!queue) {
        throw new InternalServerErrorException("Can't update queue");
      }

      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    where: Prisma.QueueWhereUniqueInput,
  ): ReturnWithErrPromise<Queue> {
    try {
      const queue = await this.prisma.queue.delete({ where });

      if (!queue) {
        throw new InternalServerErrorException("Can't delete queue");
      }

      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private async isPossibleToAdd() {}
}
