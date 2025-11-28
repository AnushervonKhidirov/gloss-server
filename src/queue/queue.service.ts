import type { Prisma, Queue } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceService } from 'src/service/service.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class QueueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceService: ServiceService,
  ) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.QueueWhereUniqueInput;
    include?: Prisma.QueueInclude;
    omit?: Prisma.QueueOmit;
  }): ReturnWithErrPromise<Queue> {
    try {
      const queue = await this.prisma.queue.findUnique({
        where,
        include,
        omit,
      });
      if (!queue) throw new NotFoundException('Queue not found');
      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.QueueWhereInput;
    include?: Prisma.QueueInclude;
    omit?: Prisma.QueueOmit;
  } = {}): ReturnWithErrPromise<Queue[]> {
    try {
      const queue = await this.prisma.queue.findMany({
        orderBy: { startAt: 'asc' },
        where,
        include,
        omit,
      });
      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
    omit,
  }: {
    data: CreateQueueDto;
    include?: Prisma.QueueInclude;
    omit?: Prisma.QueueOmit;
  }): ReturnWithErrPromise<Queue> {
    try {
      const [checkedData, err] = await this.isPossibleToBook(data);
      if (err) throw err;

      const queue = await this.prisma.queue.create({
        data: checkedData,
        include,
        omit,
      });

      if (!queue) {
        throw new InternalServerErrorException("Can't add to queue");
      }

      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    where,
    data,
    include,
    omit,
  }: {
    where: Prisma.QueueWhereUniqueInput;
    data: UpdateQueueDto;
    include?: Prisma.QueueInclude;
    omit?: Prisma.QueueOmit;
  }): ReturnWithErrPromise<Queue> {
    try {
      const [queueToUpdate, updateErr] = await this.findOne({
        where,
        omit: { id: true },
      });

      if (updateErr) throw updateErr;

      const updatedQueue = { ...queueToUpdate, ...data };
      const [checkedData, err] = await this.isPossibleToBook(updatedQueue);
      if (err) throw err;

      const queue = await this.prisma.queue.update({
        where,
        data: checkedData,
        include,
        omit,
      });

      if (!queue) {
        throw new InternalServerErrorException("Can't update queue");
      }

      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.QueueWhereUniqueInput;
    include?: Prisma.QueueInclude;
    omit?: Prisma.QueueOmit;
  }): ReturnWithErrPromise<Queue> {
    try {
      const queue = await this.prisma.queue.delete({ where, include, omit });

      if (!queue) {
        throw new InternalServerErrorException("Can't delete queue");
      }

      return [queue, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private async isPossibleToBook(
    data: CreateQueueDto,
  ): ReturnWithErrPromise<Prisma.QueueUncheckedCreateInput> {
    try {
      const [service, serviceError] = await this.serviceService.findOne({
        where: { id: data.serviceId },
      });

      if (serviceError) throw serviceError;

      const endAt = new Date(
        data.startAt.getTime() + service.duration * 60 * 1000,
      );

      const [bookedList, bookedErr] = await this.findMany({
        where: {
          userId: data.userId,
          OR: [
            { startAt: { lt: endAt }, endAt: { gte: endAt } },
            { startAt: { lte: data.startAt }, endAt: { gt: data.startAt } },
            { startAt: { gte: data.startAt }, endAt: { lte: endAt } },
          ],
        },
      });

      if (bookedErr) throw bookedErr;

      if (bookedList.length > 0) {
        throw new ConflictException(
          'There is already an appointment for this time',
        );
      }

      return [{ ...data, endAt }, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
