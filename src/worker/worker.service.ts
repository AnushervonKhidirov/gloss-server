import type { Prisma, User, WorkerServicePrice } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateWorkerServicePriceDto } from './dto/create-worker-service-price.dto';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class WorkerService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
        include,
        omit,
      });

      if (!user) throw new NotFoundException('User not found');
      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.UserWhereInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  } = {}): ReturnWithErrPromise<User[]> {
    try {
      const user = await this.prisma.user.findMany({
        where,
        include,
        omit,
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findWorkerServicePrice({
    where,
    include,
    omit,
  }: {
    where: Prisma.WorkerServicePriceWhereInput;
    include?: Prisma.WorkerServicePriceInclude;
    omit?: Prisma.WorkerServicePriceOmit;
  }): ReturnWithErrPromise<WorkerServicePrice> {
    try {
      const service = await this.prisma.workerServicePrice.findFirstOrThrow({
        where,
        include,
        omit,
      });

      return [service, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async createWorkerServicePrice({
    data,
    include,
    omit,
  }: {
    data: CreateWorkerServicePriceDto;
    include?: Prisma.WorkerServicePriceInclude;
    omit?: Prisma.WorkerServicePriceOmit;
  }): ReturnWithErrPromise<WorkerServicePrice> {
    try {
      const [check] = await this.findWorkerServicePrice({
        where: { userId: data.userId, serviceId: data.serviceId },
      });

      if (check) throw new ConflictException('Worker already has this service');

      const service = await this.prisma.workerServicePrice.create({
        data,
        include,
        omit,
      });

      return [service, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
