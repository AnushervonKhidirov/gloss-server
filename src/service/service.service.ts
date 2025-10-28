import type { Prisma, Service } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.ServiceWhereUniqueInput,
  ): ReturnWithErrPromise<Service> {
    try {
      const service = await this.prisma.service.findUnique({ where });
      if (!service) throw new NotFoundException('Service not found');
      return [service, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.ServiceWhereInput,
  ): ReturnWithErrPromise<Service[]> {
    try {
      const service = await this.prisma.service.findMany({ where });
      return [service, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
