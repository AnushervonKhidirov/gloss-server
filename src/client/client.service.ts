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

  async findOne(
    where: Prisma.ClientWhereUniqueInput,
  ): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.findUnique({ where });
      if (!client) throw new NotFoundException('Client not found');
      return [client, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.ClientWhereInput,
  ): ReturnWithErrPromise<Client[]> {
    try {
      const clients = await this.prisma.client.findMany({ where });
      return [clients, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(data: CreateClientDto): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.create({ data });

      if (!client) {
        throw new InternalServerErrorException("Can't add client");
      }

      return [client, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.ClientWhereUniqueInput,
    data: UpdateClientDto,
  ): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.update({ where, data });

      if (!client) {
        throw new InternalServerErrorException("Can't update client");
      }

      return [client, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    where: Prisma.ClientWhereUniqueInput,
  ): ReturnWithErrPromise<Client> {
    try {
      const client = await this.prisma.client.delete({ where });

      if (!client) {
        throw new InternalServerErrorException("Can't delete client");
      }

      return [client, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
