import type { Prisma, Category } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.CategoryWhereUniqueInput;
    include?: Prisma.CategoryInclude;
    omit?: Prisma.CategoryOmit;
  }): ReturnWithErrPromise<Category> {
    try {
      const category = await this.prisma.category.findUnique({
        where,
        include,
        omit,
      });
      if (!category) throw new NotFoundException('Category not found');
      return [category, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.CategoryWhereInput;
    include?: Prisma.CategoryInclude;
    omit?: Prisma.CategoryOmit;
  }): ReturnWithErrPromise<Category[]> {
    try {
      const category = await this.prisma.category.findMany({
        where,
        include,
        omit,
      });
      return [category, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
