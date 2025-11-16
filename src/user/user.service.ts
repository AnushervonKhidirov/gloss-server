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

  async findOne<T extends boolean>(
    where: Prisma.UserWhereUniqueInput,
    withPassword?: T,
  ): ReturnWithErrPromise<T extends true ? User : Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
        omit: { password: !withPassword },
      });

      if (!user) throw new NotFoundException('User not found');
      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.UserWhereInput,
  ): ReturnWithErrPromise<Omit<User, 'password'>[]> {
    try {
      const users = await this.prisma.user.findMany({
        where,
        omit: { password: true },
      });

      return [users, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    username,
    password,
    firstName,
    lastName,
  }: CreateUserDto): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const hashedPassword = await hash(password, 10);

      const user = await this.prisma.user.create({
        data: { username, password: hashedPassword, firstName, lastName },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    { username, password, firstName, lastName }: UpdateUserDto,
  ): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const hashedPassword = password && (await hash(password, 10));

      const user = await this.prisma.user.update({
        data: { username, firstName, lastName, password: hashedPassword },
        where,
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.UserWhereUniqueInput,
  ): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.update({
        where,
        data: { archived: true },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async unarchive(
    where: Prisma.UserWhereUniqueInput,
  ): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.update({
        where,
        data: { archived: false },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    where: Prisma.UserWhereUniqueInput,
  ): ReturnWithErrPromise<Omit<User, 'password'>> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where,
        omit: { password: true },
      });

      return [deletedUser, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
