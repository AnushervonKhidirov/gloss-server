import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TokenModule],
  providers: [ServiceService, PrismaService],
  controllers: [ServiceController],
})
export class ServiceModule {}
