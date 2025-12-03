import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlackListService } from './black-list.service';
import { CreateBlackListDto } from './dto/create-black-list.dto';

@Controller('black-list')
@UseGuards(AuthGuard)
export class BlackListController {
  constructor(private readonly blackListService: BlackListService) {}

  @Get()
  async findMany() {
    const [blackList, err] = await this.blackListService.findMany();
    if (err) throw err;
    return blackList;
  }

  @Post()
  async create(@Body(new ValidationPipe()) data: CreateBlackListDto) {
    const [blackList, err] = await this.blackListService.create({ data });
    if (err) throw err;
    return blackList;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const [blackList, err] = await this.blackListService.delete({
      where: { id },
    });
    if (err) throw err;
    return blackList;
  }
}
