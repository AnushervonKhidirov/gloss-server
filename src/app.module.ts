import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { PrismaService } from './prisma/prisma.service';
import { ServiceModule } from './service/service.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CategoryModule,
    ServiceModule,
    WorkerModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
