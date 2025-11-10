import type { Prisma, Service, WorkerService } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateWorkerServiceDto } from './dto/create-worker-service-price.dto';

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

  async findAllWorkerService({
    where,
    include,
    omit,
  }: {
    where: Prisma.WorkerServiceWhereInput;
    include?: Prisma.WorkerServiceInclude;
    omit?: Prisma.WorkerServiceOmit;
  }): ReturnWithErrPromise<WorkerService[]> {
    try {
      const services = await this.prisma.workerService.findMany({
        where,
        include,
        omit,
      });

      return [services, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findWorkerService({
    where,
    include,
    omit,
  }: {
    where: Prisma.WorkerServiceWhereInput;
    include?: Prisma.WorkerServiceInclude;
    omit?: Prisma.WorkerServiceOmit;
  }): ReturnWithErrPromise<WorkerService> {
    try {
      const service = await this.prisma.workerService.findFirstOrThrow({
        where,
        include,
        omit,
      });

      return [service, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async createWorkerService({
    data,
    include,
    omit,
  }: {
    data: CreateWorkerServiceDto;
    include?: Prisma.WorkerServiceInclude;
    omit?: Prisma.WorkerServiceOmit;
  }): ReturnWithErrPromise<WorkerService> {
    try {
      const [check] = await this.findWorkerService({
        where: { userId: data.userId, serviceId: data.serviceId },
      });

      if (check) throw new ConflictException('Worker already has this service');

      const service = await this.prisma.workerService.create({
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
