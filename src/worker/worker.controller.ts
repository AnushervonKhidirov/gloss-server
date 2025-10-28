import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [user, err] = await this.workerService.findOne({ id });
    if (err) throw err;
    return user;
  }

  @Get()
  async findMany() {
    const [users, err] = await this.workerService.findMany();
    if (err) throw err;
    return users;
  }
}
