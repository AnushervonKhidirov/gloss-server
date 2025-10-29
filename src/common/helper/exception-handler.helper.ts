import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from 'generated/prisma/runtime/library';

export function exceptionHandler(err: unknown): [null, HttpException] {
  if (err instanceof HttpException) return [null, err];
  if (isPrismaError(err)) return [null, prismaErrHandler(err)];

  if (err instanceof PrismaClientValidationError) {
    return [null, new BadRequestException()];
  }

  return [
    null,
    new InternalServerErrorException(
      'Something went wrong, please try again later',
    ),
  ];
}

function prismaErrHandler(err: PrismaClientKnownRequestError) {
  const Error: {
    [key: PrismaClientKnownRequestError['code']]: HttpException;
  } = {
    P2025: new NotFoundException(err.meta?.cause),
    P2002: new ConflictException(err.meta?.cause),
  };

  if (!Error[err.code]) return new InternalServerErrorException();
  return Error[err.code];
}

function isPrismaError(err: unknown) {
  return err instanceof PrismaClientKnownRequestError;
}
