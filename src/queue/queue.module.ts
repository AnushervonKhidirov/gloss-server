import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { ServiceService } from 'src/service/service.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [QueueService, ServiceService, PrismaService],
  controllers: [QueueController],
})
export class QueueModule {}
