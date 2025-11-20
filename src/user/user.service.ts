import type { Prisma, User } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcryptjs';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class UserService {
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
  } = {}): ReturnWithErrPromise<Omit<User, 'password'>[]> {
    try {
      const users = await this.prisma.user.findMany({
        where,
        include,
        omit,
      });

      return [users, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
    omit,
  }: {
    data: CreateUserDto;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const { username, firstName, lastName, password } = data;
      const hashedPassword = await hash(password, 10);

      const user = await this.prisma.user.create({
        data: { username, password: hashedPassword, firstName, lastName },
        include,
        omit,
      });

      return [user, null];
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
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const { username, firstName, lastName, password } = data;
      const hashedPassword = password && (await hash(password, 10));

      const user = await this.prisma.user.update({
        where,
        data: { username, firstName, lastName, password: hashedPassword },
        include,
        omit,
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive({
    where,
    include,
    omit,
  }: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.update({
        where,
        data: { archived: true },
        include,
        omit,
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async unarchive({
    where,
    include,
    omit,
  }: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.update({
        where,
        data: { archived: false },
        include,
        omit,
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    omit?: Prisma.UserOmit;
  }): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where,
        include,
        omit,
      });

      return [deletedUser, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
