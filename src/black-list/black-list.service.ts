import type { Prisma, BlackList } from 'generated/prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlackListDto } from './dto/create-black-list.dto';

import { exceptionHandler } from 'src/utils/helper/exception-handler.helper';
import { ReturnWithErrPromise } from 'src/type/return-with-err.type';

@Injectable()
export class BlackListService {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst({
    where,
    omit,
  }: {
    where: Prisma.BlackListWhereInput;
    omit?: Prisma.BlackListOmit;
  }): ReturnWithErrPromise<BlackList | null> {
    try {
      const blackList = await this.prisma.blackList.findFirst({ where, omit });

      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findOne({
    where,
    omit,
  }: {
    where: Prisma.BlackListWhereUniqueInput;
    omit?: Prisma.BlackListOmit;
  }): ReturnWithErrPromise<BlackList | null> {
    try {
      const blackList = await this.prisma.blackList.findUnique({ where, omit });

      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    omit,
  }: {
    where?: Prisma.BlackListWhereInput;
    omit?: Prisma.BlackListOmit;
  } = {}): ReturnWithErrPromise<BlackList[]> {
    try {
      const blackList = await this.prisma.blackList.findMany({ where, omit });
      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    omit,
  }: {
    data: CreateBlackListDto;
    omit?: Prisma.BlackListOmit;
  }): ReturnWithErrPromise<BlackList> {
    try {
      const blackList = await this.prisma.blackList.create({ data, omit });

      const client = await this.prisma.client.findFirst({
        where: { phone: blackList.phone },
      });

      if (client) {
        await this.prisma.client.update({
          where: { phone: blackList.phone },
          data: { blocked: true },
        });
      }

      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    omit,
  }: {
    where: Prisma.BlackListWhereUniqueInput;
    omit?: Prisma.BlackListOmit;
  }): ReturnWithErrPromise<BlackList> {
    try {
      const blackList = await this.prisma.blackList.delete({
        where,
        omit,
      });

      const client = await this.prisma.client.findFirst({
        where: { phone: blackList.phone },
      });

      if (client) {
        await this.prisma.client.update({
          where: { phone: blackList.phone },
          data: { blocked: false },
        });
      }

      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
