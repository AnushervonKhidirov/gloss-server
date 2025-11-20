import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { ServiceService } from 'src/service/service.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TokenModule],
  providers: [QueueService, ServiceService, PrismaService],
  controllers: [QueueController],
})
export class QueueModule {}
