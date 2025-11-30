import type { Prisma, Appointment } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/type/return-with-err.type';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceService } from 'src/service/service.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { exceptionHandler } from 'src/utils/helper/exception-handler.helper';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceService: ServiceService,
  ) {}

  async findOne({
    where,
    include,
    omit,
  }: {
    where: Prisma.AppointmentWhereUniqueInput;
    include?: Prisma.AppointmentInclude;
    omit?: Prisma.AppointmentOmit;
  }): ReturnWithErrPromise<Appointment> {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where,
        include,
        omit,
      });
      if (!appointment) throw new NotFoundException('Очередь не найдена');
      return [appointment, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany({
    where,
    include,
    omit,
  }: {
    where?: Prisma.AppointmentWhereInput;
    include?: Prisma.AppointmentInclude;
    omit?: Prisma.AppointmentOmit;
  } = {}): ReturnWithErrPromise<Appointment[]> {
    try {
      const appointment = await this.prisma.appointment.findMany({
        orderBy: { startAt: 'asc' },
        where,
        include,
        omit,
      });
      return [appointment, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    data,
    include,
    omit,
  }: {
    data: CreateAppointmentDto;
    include?: Prisma.AppointmentInclude;
    omit?: Prisma.AppointmentOmit;
  }): ReturnWithErrPromise<Appointment> {
    try {
      const [checkedData, err] = await this.isPossibleToBook(data);
      if (err) throw err;

      const appointment = await this.prisma.appointment.create({
        data: checkedData,
        include,
        omit,
      });

      if (!appointment) {
        throw new InternalServerErrorException('Не удается добавить в очередь');
      }

      return [appointment, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update({
    where,
    data,
    include,
    omit,
  }: {
    where: Prisma.AppointmentWhereUniqueInput;
    data: UpdateAppointmentDto;
    include?: Prisma.AppointmentInclude;
    omit?: Prisma.AppointmentOmit;
  }): ReturnWithErrPromise<Appointment> {
    try {
      const [appointmentToUpdate, updateErr] = await this.findOne({
        where,
        omit: { id: true },
      });

      if (updateErr) throw updateErr;

      const updatedAppointment = { ...appointmentToUpdate, ...data };
      const [checkedData, err] =
        await this.isPossibleToBook(updatedAppointment);

      if (err) throw err;

      const appointment = await this.prisma.appointment.update({
        where,
        data: checkedData,
        include,
        omit,
      });

      if (!appointment) {
        throw new InternalServerErrorException('Не удается обновить очередь');
      }

      return [appointment, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete({
    where,
    include,
    omit,
  }: {
    where: Prisma.AppointmentWhereUniqueInput;
    include?: Prisma.AppointmentInclude;
    omit?: Prisma.AppointmentOmit;
  }): ReturnWithErrPromise<Appointment> {
    try {
      const appointment = await this.prisma.appointment.delete({
        where,
        include,
        omit,
      });

      if (!appointment) {
        throw new InternalServerErrorException('Не удается удалить очередь');
      }

      return [appointment, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private async isPossibleToBook(
    data: CreateAppointmentDto,
  ): ReturnWithErrPromise<Prisma.AppointmentUncheckedCreateInput> {
    try {
      const [service, serviceError] = await this.serviceService.findOne({
        where: { id: data.serviceId },
      });

      if (serviceError) throw serviceError;

      const endAt = new Date(
        data.startAt.getTime() + service.duration * 60 * 1000,
      );

      const [bookedList, bookedErr] = await this.findMany({
        where: {
          userId: data.userId,
          OR: [
            { startAt: { lt: endAt }, endAt: { gte: endAt } },
            { startAt: { lte: data.startAt }, endAt: { gt: data.startAt } },
            { startAt: { gte: data.startAt }, endAt: { lte: endAt } },
          ],
        },
      });

      if (bookedErr) throw bookedErr;

      if (bookedList.length > 0) {
        throw new ConflictException('На это время уже назначена встреча');
      }

      return [{ ...data, endAt }, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
