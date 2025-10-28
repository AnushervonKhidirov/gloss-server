import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ServiceService, PrismaService],
  controllers: [ServiceController],
})
export class ServiceModule {}
