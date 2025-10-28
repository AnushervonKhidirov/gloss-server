import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';
import type { Prisma, Category } from 'generated/prisma/client';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.CategoryWhereUniqueInput,
  ): ReturnWithErrPromise<Category> {
    try {
      const category = await this.prisma.category.findUnique({ where });
      if (!category) throw new NotFoundException('Category not found');
      return [category, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.CategoryWhereInput,
  ): ReturnWithErrPromise<Category[]> {
    try {
      const category = await this.prisma.category.findMany({ where });
      return [category, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
