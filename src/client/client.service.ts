import type { Prisma, Client } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.ClientWhereUniqueInput;
    include?: Prisma.ClientInclude;
    omit?: Prisma.ClientOmit;
  }): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.findUnique({
        where,
        include,
        omit,
      });
      if (!client) throw new NotFoundException('Клиент не найден');
      return [client, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.ClientWhereInput;
    include?: Prisma.ClientInclude;
    omit?: Prisma.ClientOmit;
  } = {}): ReturnWithErrPromise<Client[]> {
    try {
      const clients = await this.prisma.client.findMany({
        where,
        include,
        omit,
      });
      return [clients, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
    omit,
  }: {
    data: CreateClientDto;
    include?: Prisma.ClientInclude;
    omit?: Prisma.ClientOmit;
  }): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.create({ data, include, omit });

      if (!client) {
        throw new InternalServerErrorException('Не удается добавить клиента');
      }

      return [client, null];
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
    where: Prisma.ClientWhereUniqueInput;
    data: UpdateClientDto;
    include?: Prisma.ClientInclude;
    omit?: Prisma.ClientOmit;
  }): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.update({
        where,
        data,
        include,
        omit,
      });

      if (!client) {
        throw new InternalServerErrorException('Не удается обновить клиент');
      }

      return [client, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.ClientWhereUniqueInput;
    include?: Prisma.ClientInclude;
    omit?: Prisma.ClientOmit;
  }): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.delete({ where, include, omit });

      if (!client) {
        throw new InternalServerErrorException('Не удается удалить клиента');
      }

      return [client, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
