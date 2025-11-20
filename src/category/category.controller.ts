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

import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [category, err] = await this.categoryService.findOne({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return category;
  }

  @Get()
  async findMany() {
    const [categories, err] = await this.categoryService.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return categories;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Post()
  async create(@Body(new ValidationPipe()) data: CreateCategoryDto) {
    const [category, err] = await this.categoryService.create({
      data,
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return category;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateCategoryDto,
  ) {
    const [category, err] = await this.categoryService.update({
      where: { id },
      data,
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return category;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [category, err] = await this.categoryService.delete({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return category;
  }
}
