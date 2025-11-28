import { Module } from '@nestjs/common';
import { TokenModule } from 'src/token/token.module';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TokenModule],
  providers: [ClientService, PrismaService],
  controllers: [ClientController],
})
export class ClientModule {}
