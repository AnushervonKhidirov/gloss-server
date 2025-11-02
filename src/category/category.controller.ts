import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [data, err] = await this.categoryService.findOne({ where: { id } });
    if (err) throw err;
    return data;
  }

  @Get()
  async findMany() {
    const [data, err] = await this.categoryService.findMany();
    if (err) throw err;
    return data;
  }
}
