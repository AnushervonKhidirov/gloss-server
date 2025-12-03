import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlackListService } from './black-list.service';
import { BlackListController } from './black-list.controller';

@Module({
  imports: [TokenModule],
  providers: [BlackListService, PrismaService],
  controllers: [BlackListController],
  exports: [BlackListService],
})
export class BlackListModule {}
