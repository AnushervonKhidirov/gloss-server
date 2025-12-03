import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { BlackListModule } from 'src/black-list/black-list.module';
import { ClientModule } from 'src/client/client.module';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { ServiceService } from 'src/service/service.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TokenModule, BlackListModule, ClientModule],
  providers: [AppointmentService, ServiceService, PrismaService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
