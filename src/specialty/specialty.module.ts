import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TokenModule],
  providers: [SpecialtyService, PrismaService],
  controllers: [SpecialtyController],
})
export class SpecialtyModule {}
