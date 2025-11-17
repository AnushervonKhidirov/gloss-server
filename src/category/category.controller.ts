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
    });
    if (err) throw err;
    return category;
  }

  @Get()
  async findMany() {
    const [categories, err] = await this.categoryService.findMany();
    if (err) throw err;
    return categories;
  }

  @Post()
  async create(@Body(new ValidationPipe()) data: CreateCategoryDto) {
    const [category, err] = await this.categoryService.create(data);
    if (err) throw err;
    return category;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateCategoryDto,
  ) {
    const [category, err] = await this.categoryService.update(id, data);
    if (err) throw err;
    return category;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [category, err] = await this.categoryService.delete(id);
    if (err) throw err;
    return category;
  }
}
