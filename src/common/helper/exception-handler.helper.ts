import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function exceptionHandler(err: unknown): [null, HttpException] {
  if (err instanceof HttpException) return [null, err];

  return [
    null,
    new InternalServerErrorException(
      'Something went wrong, please try again later',
    ),
  ];
}
