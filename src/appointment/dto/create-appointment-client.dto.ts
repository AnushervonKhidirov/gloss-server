import { IntersectionType, OmitType } from '@nestjs/swagger';

import { CreateAppointmentDto } from './create-appointment.dto';
import { CreateClientDto } from 'src/client/dto/create-client.dto';

export class CreateAppointmentClientDto extends OmitType(
  IntersectionType(CreateAppointmentDto, CreateClientDto),
  ['clientId'],
) {}
