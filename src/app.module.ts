import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { PrismaService } from './prisma/prisma.service';
import { ServiceModule } from './service/service.module';
import { WorkerModule } from './worker/worker.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CategoryModule,
    ServiceModule,
    WorkerModule,
    QueueModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
