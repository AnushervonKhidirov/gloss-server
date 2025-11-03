import type { Prisma } from 'generated/prisma/client';

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WorkerService } from './worker.service';

const fieldsToOmit: Prisma.UserOmit = {
  username: true,
  password: true,
  role: true,
  archived: true,
  createdAt: true,
  updatedAt: true,
};

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [user, err] = await this.workerService.findOne({
      where: { id },
      omit: fieldsToOmit,
      include: {
        categories: { omit: { createdAt: true, updatedAt: true } },
        queue: true,
      },
    });
    if (err) throw err;
    return user;
  }

  @Get()
  async findMany() {
    const [users, err] = await this.workerService.findMany({
      omit: fieldsToOmit,
      include: {
        categories: { omit: { createdAt: true, updatedAt: true } },
        queue: true,
      },
    });
    if (err) throw err;
    return users;
  }
}
