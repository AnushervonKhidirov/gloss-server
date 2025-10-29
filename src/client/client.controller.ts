import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [client, err] = await this.clientService.findOne({ id });
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
    const [client, err] = await this.clientService.create(data);
    if (err) throw err;
    return client;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateClientDto,
  ) {
    const [client, err] = await this.clientService.update({ id }, data);
    if (err) throw err;
    return client;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [client, err] = await this.clientService.delete({ id });
    if (err) throw err;
    return client;
  }
}
