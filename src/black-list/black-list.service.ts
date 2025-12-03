import { Injectable } from '@nestjs/common';
import { BlackList } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlackListDto } from './dto/create-black-list.dto';

import { exceptionHandler } from 'src/utils/helper/exception-handler.helper';
import { ReturnWithErrPromise } from 'src/type/return-with-err.type';

@Injectable()
export class BlackListService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): ReturnWithErrPromise<BlackList[]> {
    try {
      const blackList = await this.prisma.blackList.findMany();
      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(data: CreateBlackListDto): ReturnWithErrPromise<BlackList> {
    try {
      const blackList = await this.prisma.blackList.create({ data });
      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(id: number): ReturnWithErrPromise<BlackList> {
    try {
      const blackList = await this.prisma.blackList.delete({ where: { id } });
      return [blackList, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
