import type { Prisma, User } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
