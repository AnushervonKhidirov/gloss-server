import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

import { ClientService } from './client.service';
import { BlackListService } from 'src/black-list/black-list.service';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindQueryClientDto } from './dto/find-query-client.dto';

@UseGuards(AuthGuard)
@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly blackListService: BlackListService,
  ) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [client, err] = await this.clientService.findOne({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    if (err) throw err;
    return client;
  }

  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true }))
    { name, phone, omitBlackList }: FindQueryClientDto,
  ) {
    let blackListPhones: string[] = [];

    if (omitBlackList) {
      const [blackList, blackListErr] = await this.blackListService.findMany();
      if (blackListErr) throw blackListErr;
      blackListPhones = blackList.map((item) => item.phone);
    }
    const [clients, err] = await this.clientService.findMany({
      where: { name, phone: { equals: phone, notIn: blackListPhones } },
      omit: { createdAt: true, updatedAt: true },
    });

    if (err) throw err;
    return clients;
  }

  @Post()
  async create(@Body(new ValidationPipe()) data: CreateClientDto) {
    const [blockedClient] = await this.blackListService.findFirst({
      where: { phone: data.phone },
    });

    if (blockedClient) {
      await this.blackListService.delete({ where: { id: blockedClient.id } });
    }

    const [client, err] = await this.clientService.create({
      data,
      omit: { createdAt: true, updatedAt: true },
    });

    if (err) throw err;
    return client;
  }

  @UseGuards(RoleGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateClientDto,
  ) {
    const [client, err] = await this.clientService.update({
      where: { id },
      data,
      omit: { createdAt: true, updatedAt: true },
    });

    if (err) throw err;
    return client;
  }

  @UseGuards(RoleGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [client, err] = await this.clientService.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });

    if (err) throw err;
    return client;
  }
}
