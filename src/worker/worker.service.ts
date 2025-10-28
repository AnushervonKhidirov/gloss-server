import type { Prisma, User } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

const fieldsToOmit: Prisma.UserOmit = {
  username: true,
  password: true,
  role: true,
  archived: true,
};

@Injectable()
export class WorkerService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.UserWhereUniqueInput,
  ): ReturnWithErrPromise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
        omit: fieldsToOmit,
      });

      if (!user) throw new NotFoundException('User not found');
      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(where?: Prisma.UserWhereInput): ReturnWithErrPromise<User[]> {
    try {
      const user = await this.prisma.user.findMany({
        where,
        omit: fieldsToOmit,
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
