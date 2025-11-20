import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TokenModule],
  providers: [CategoryService, PrismaService],
  controllers: [CategoryController],
})
export class CategoryModule {}
