import type { Request } from 'express';
import type { UserTokenPayload } from 'src/token/type/token.type';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Req,
  ForbiddenException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, Role } from 'generated/prisma/client';

const userInclude: Prisma.UserInclude = {
  specialty: { omit: { createdAt: true, updatedAt: true } },
};

const userOmit: Prisma.UserOmit = {
  password: true,
  createdAt: true,
  updatedAt: true,
};

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMany() {
    const [users, err] = await this.userService.findMany({
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return users;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findMe(@Req() request: Request) {
    const userPayload: UserTokenPayload = request['user'];

    const [user, err] = await this.userService.findOne({
      where: { id: +userPayload.sub },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [user, err] = await this.userService.findOne({
      where: { id },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  async updateSelected(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateUserDto,
  ) {
    const { username, firstName, lastName, password } = data;

    const [user, err] = await this.userService.update({
      where: { id },
      data: { username, firstName, lastName, password },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Body(new ValidationPipe()) data: UpdateUserDto,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload = request['user'];
    const { username, firstName, lastName, password } = data;

    const [user, err] = await this.userService.update({
      where: { id: +userPayload.sub },
      data: { username, firstName, lastName, password },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch('archive/:id')
  async archiveUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload = request['user'];
    if (+userPayload.sub === id) {
      throw new ForbiddenException('Нельзя уволить себя если вы Администрарот');
    }

    const [user, err] = await this.userService.update({
      where: { id },
      data: { archived: true },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['WORKER'])
  @Patch('archive')
  async archive(@Req() request: Request) {
    const userPayload: UserTokenPayload = request['user'];

    const [user, err] = await this.userService.update({
      where: { id: +userPayload.sub },
      data: { archived: true },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch('unarchive/:id')
  async unarchiveUser(@Param('id', ParseIntPipe) id: number) {
    const [user, err] = await this.userService.update({
      where: { id },
      data: { archived: false },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch('approve/:id')
  async approveUser(@Param('id', ParseIntPipe) id: number) {
    const [user, err] = await this.userService.update({
      where: { id },
      data: { verified: true },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userPayload: UserTokenPayload = request['user'];
    if (+userPayload.sub === id) {
      throw new ForbiddenException(
        'Нельзя удалить свой аккаунт если вы Администрарот',
      );
    }

    const [user, err] = await this.userService.delete({
      where: { id },
      include: userInclude,
      omit: userOmit,
    });

    if (err) throw err;
    return user;
  }
}
