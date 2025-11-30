import type { Prisma, Specialty } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

import { exceptionHandler } from 'src/utils/helper/exception-handler.helper';

@Injectable()
export class SpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.SpecialtyWhereUniqueInput;
    include?: Prisma.SpecialtyInclude;
    omit?: Prisma.SpecialtyOmit;
  }): ReturnWithErrPromise<Specialty> {
    try {
      const specialty = await this.prisma.specialty.findUnique({
        where,
        include,
        omit,
      });
      if (!specialty) throw new NotFoundException('Специальность не найдена');
      return [specialty, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.SpecialtyWhereInput;
    include?: Prisma.SpecialtyInclude;
    omit?: Prisma.SpecialtyOmit;
  } = {}): ReturnWithErrPromise<Specialty[]> {
    try {
      const specialties = await this.prisma.specialty.findMany({
        where,
        include,
        omit,
      });
      return [specialties, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
    omit,
  }: {
    data: CreateSpecialtyDto;
    include?: Prisma.SpecialtyInclude;
    omit?: Prisma.SpecialtyOmit;
  }): ReturnWithErrPromise<Specialty> {
    try {
      const specialty = await this.prisma.specialty.create({
        data,
        include,
        omit,
      });
      return [specialty, null];
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
    where: Prisma.SpecialtyWhereUniqueInput;
    data: UpdateSpecialtyDto;
    include?: Prisma.SpecialtyInclude;
    omit?: Prisma.SpecialtyOmit;
  }): ReturnWithErrPromise<Specialty> {
    try {
      const specialty = await this.prisma.specialty.update({
        where,
        data: { ...data, desc: data.desc ?? null },
        include,
        omit,
      });
      return [specialty, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.SpecialtyWhereUniqueInput;
    include?: Prisma.SpecialtyInclude;
    omit?: Prisma.SpecialtyOmit;
  }): ReturnWithErrPromise<Specialty> {
    try {
      const specialty = await this.prisma.specialty.delete({
        where,
        include,
        omit,
      });
      return [specialty, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
