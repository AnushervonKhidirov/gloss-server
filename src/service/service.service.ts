import type { Prisma, Service, WorkerService } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { WorkerServiceDto } from './dto/worker-service-price.dto';

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

  async create({
    data,
    include,
    omit,
  }: {
    data: CreateServiceDto;
    include?: Prisma.ServiceInclude;
    omit?: Prisma.ServiceOmit;
  }): ReturnWithErrPromise<Service> {
    try {
      const service = await this.prisma.service.create({ data, include, omit });
      return [service, null];
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
    where: Prisma.ServiceWhereUniqueInput;
    data: UpdateServiceDto;
    include?: Prisma.ServiceInclude;
    omit?: Prisma.ServiceOmit;
  }): ReturnWithErrPromise<Service> {
    try {
      const service = await this.prisma.service.update({
        where,
        data,
        include,
        omit,
      });
      return [service, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.ServiceWhereUniqueInput;
    include?: Prisma.ServiceInclude;
    omit?: Prisma.ServiceOmit;
  }): ReturnWithErrPromise<Service> {
    try {
      const service = await this.prisma.service.delete({
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

  async findWorkerServices({
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

  async workerServiceHandler({
    userId,
    data,
    include,
    omit,
  }: {
    userId: number;
    data: WorkerServiceDto[];
    include?: Prisma.WorkerServiceInclude;
    omit?: Prisma.WorkerServiceOmit;
  }): ReturnWithErrPromise<WorkerService[]> {
    try {
      const [services, findError] = await this.findWorkerServices({
        where: { userId: userId },
      });

      if (findError) throw findError;

      const toCreate: Prisma.WorkerServiceCreateManyInput[] = [];
      const toUpdate: { id: number; price: number | null }[] = [];
      const toDelete = [...services];

      for (const workerService of data) {
        const foundIndex = toDelete.findIndex(
          (service) =>
            service.userId === userId &&
            service.serviceId === workerService.serviceId,
        );

        if (foundIndex !== -1) {
          const service = toDelete.splice(foundIndex, 1)[0];

          toUpdate.push({
            ...service,
            price: workerService.price ?? null,
          });
        } else {
          toCreate.push({ ...workerService, userId });
        }
      }

      await this.prisma.workerService.createMany({ data: toCreate });

      for (const data of toUpdate) {
        await this.prisma.workerService.update({
          where: { id: data.id },
          data,
        });
      }

      await this.prisma.workerService.deleteMany({
        where: { id: { in: toDelete.map((service) => service.id) } },
      });

      const result = await this.prisma.workerService.findMany({
        where: { userId },
        include,
        omit,
      });

      return [result, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
