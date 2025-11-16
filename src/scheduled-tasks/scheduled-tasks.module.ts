import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
  providers: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
