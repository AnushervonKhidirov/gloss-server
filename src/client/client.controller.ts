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
} from '@nestjs/common';
import { ClientService } from './client.service';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindQueryClientDto } from './dto/find-query-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('/find')
  async findOneQuery(
    @Query(new ValidationPipe()) { phone }: FindQueryClientDto,
  ) {
    const [client, err] = await this.clientService.findOne({
      where: { phone },
    });
    if (err) throw err;
    return client;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [client, err] = await this.clientService.findOne({ where: { id } });
    if (err) throw err;
    return client;
  }

  @Get()
  async findMany() {
    const [clients, err] = await this.clientService.findMany();
    if (err) throw err;
    return clients;
  }

  @Post()
  async create(@Body(new ValidationPipe()) data: CreateClientDto) {
    const [client, err] = await this.clientService.create({ data });
    if (err) throw err;
    return client;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateClientDto,
  ) {
    const [client, err] = await this.clientService.update({
      where: { id },
      data,
    });
    if (err) throw err;
    return client;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [client, err] = await this.clientService.delete({ where: { id } });
    if (err) throw err;
    return client;
  }
}
