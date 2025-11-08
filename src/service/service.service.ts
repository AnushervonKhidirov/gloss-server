import type {
  Prisma,
  Service,
  WorkerServicePrice,
} from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateWorkerServicePriceDto } from './dto/create-worker-service-price.dto';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.ServiceWhereUniqueInput;
    include?: Prisma.ServiceInclude;
    omit?: Prisma.ServiceOmit;
  }): ReturnWithErrPromise<Service> {
    try {
      const service = await this.prisma.service.findUnique({
        where,
        include,
        omit,
      });
      if (!service) throw new NotFoundException('Service not found');
      return [service, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.ServiceWhereInput;
    include?: Prisma.ServiceInclude;
    omit?: Prisma.ServiceOmit;
  } = {}): ReturnWithErrPromise<Service[]> {
    try {
      const service = await this.prisma.service.findMany({
        where,
        include,
        omit,
      });
      return [service, null];
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
