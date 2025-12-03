import type { Prisma } from 'generated/prisma/client';
import type { UserTokenPayload } from 'src/token/type/token.type';

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'generated/prisma/client';

import { AppointmentService } from './appointment.service';
import { BlackListService } from 'src/black-list/black-list.service';
import { ClientService } from 'src/client/client.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FindQueryAppointmentDto } from './dto/find-query-appointment.dto';
import { CreateAppointmentClientDto } from './dto/create-appointment-client.dto';

const appointmentIncludes = (
  serviceId?: number,
): Prisma.AppointmentInclude => ({
  client: { omit: { createdAt: true, updatedAt: true } },
  service: { omit: { createdAt: true, updatedAt: true } },
  user: {
    include: {
      workerService: {
        where: { serviceId },
        select: { serviceId: true, price: true },
      },
    },
    omit: {
      username: true,
      password: true,
      role: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
    },
  },
});

@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly blackListService: BlackListService,
    private readonly clientService: ClientService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [appointment, err] = await this.appointmentService.findOne({
      where: { id },
      include: appointmentIncludes(),
    });

    if (err) throw err;
    return appointment;
  }

  @UseGuards(AuthGuard)
  @Get()
  async findMany(
    @Query(new ValidationPipe({ transform: true }))
    {
      userId,
      exceptUserId,
      clientId,
      serviceId,
      dateFrom,
      dateTo,
    }: FindQueryAppointmentDto,
  ) {
    const [appointments, err] = await this.appointmentService.findMany({
      where: {
        userId: { equals: userId, not: exceptUserId },
        clientId: clientId,
        serviceId: serviceId,
        OR: [
          { startAt: { gte: dateFrom } },
          { endAt: { gte: dateFrom, lt: dateTo } },
        ],
      },
      include: appointmentIncludes(serviceId),
    });
    if (err) throw err;
    return appointments;
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) data: CreateAppointmentDto,
  ) {
    const [appointment, err] = await this.appointmentService.create({
      data,
      include: appointmentIncludes(),
    });
    if (err) throw err;
    return appointment;
  }

  @Post('/with_client')
  async createWithClient(
    @Body(new ValidationPipe({ transform: true }))
    data: CreateAppointmentClientDto,
  ) {
    const { phone, name, ...appointmentData } = data;

    const [isBlocked] = await this.blackListService.findFirst({
      where: { phone },
    });

    if (isBlocked) throw new ForbiddenException();

    const [client, clientErr] = await this.clientService.findOrCreate({
      data: { phone, name },
    });

    if (clientErr) throw clientErr;

    const [appointment, err] = await this.appointmentService.create({
      data: { ...appointmentData, clientId: client.id },
    });

    if (err) throw err;
    return appointment;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) data: UpdateAppointmentDto,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload = request['user'];
    const isAdmin = userPayload.role === Role.ADMIN;
    const userId = +userPayload.sub;

    const [appointment, err] = await this.appointmentService.findOne({
      where: { id },
    });

    if (err) throw err;
    if (appointment.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Только администратору разрешено редактировать чужую очередь',
      );
    }

    const [appointmentToUpdate, appointmentToUpdateErr] =
      await this.appointmentService.update({
        where: { id },
        data,
        include: appointmentIncludes(),
      });
    if (appointmentToUpdateErr) throw appointmentToUpdateErr;
    return appointmentToUpdate;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userPayload: UserTokenPayload = request['user'];

    const isAdmin = userPayload.role === Role.ADMIN;
    const userId = +userPayload.sub;
    const now = new Date();

    const [appointment, err] = await this.appointmentService.findOne({
      where: { id },
    });

    if (err) throw err;

    if (appointment.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Только администратору разрешено удалять чужую очередь',
      );
    }

    if (now >= appointment.endAt && !isAdmin) {
      throw new ForbiddenException(
        'Только администратору разрешено удалять оконченные предоставленные услуги',
      );
    }

    const [appointmentToDelete, appointmentToDeleteErr] =
      await this.appointmentService.delete({
        where: { id },
        include: appointmentIncludes(),
      });
    if (appointmentToDeleteErr) throw appointmentToDeleteErr;
    return appointmentToDelete;
  }
}
