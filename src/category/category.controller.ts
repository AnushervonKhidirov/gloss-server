import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const [data, err] = this.categoryService.findOne(id);
    if (err) throw err;
    return data;
  }

  @Get()
  findMany() {
    const [data, err] = this.categoryService.findMany();
    if (err) throw err;
    return data;
  }
}
