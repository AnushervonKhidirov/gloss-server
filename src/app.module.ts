import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { CategoryModule } from './category/category.module';
import { SpecialtyModule } from './specialty/specialty.module';
import { PrismaService } from './prisma/prisma.service';
import { ServiceModule } from './service/service.module';
import { WorkerModule } from './worker/worker.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClientModule } from './client/client.module';
import { BlackListModule } from './black-list/black-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    TokenModule,
    CategoryModule,
    SpecialtyModule,
    ServiceModule,
    WorkerModule,
    AppointmentModule,
    ClientModule,
    BlackListModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
