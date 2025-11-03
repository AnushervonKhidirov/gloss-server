import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [service, err] = await this.serviceService.findOne({
      where: { id },
      include: { category: { omit: { createdAt: true, updatedAt: true } } },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return service;
  }

  @Get()
  async findMany() {
    const [services, err] = await this.serviceService.findMany({
      include: { category: { omit: { createdAt: true, updatedAt: true } } },
      omit: { createdAt: true, updatedAt: true },
    });
    if (err) throw err;
    return services;
  }
}
