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
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

import { SpecialtyService } from './specialty.service';

import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [specialty, err] = await this.specialtyService.findOne({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return specialty;
  }

  @Get()
  async findMany() {
    const [specialties, err] = await this.specialtyService.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return specialties;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Post()
  async create(@Body(new ValidationPipe()) data: CreateSpecialtyDto) {
    const [specialty, err] = await this.specialtyService.create({
      data,
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return specialty;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateSpecialtyDto,
  ) {
    const [specialty, err] = await this.specialtyService.update({
      where: { id },
      data,
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return specialty;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [specialty, err] = await this.specialtyService.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return specialty;
  }
}
