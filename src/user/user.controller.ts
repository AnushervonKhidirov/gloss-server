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
  UnauthorizedException,
  ForbiddenException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMany() {
    const [users, err] = await this.userService.findMany({
      omit: { password: true },
    });

    if (err) throw err;
    return users;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findMe(@Req() request: Request) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [user, err] = await this.userService.findOne({
      where: { id: +userPayload.sub },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [user, err] = await this.userService.findOne({
      where: { id },
      omit: { password: true },
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
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();
    if (+userPayload.sub === id) throw new ForbiddenException();

    const { username, firstName, lastName, password } = data;

    const [user, err] = await this.userService.update({
      where: { id },
      data: { username, firstName, lastName, password },
      omit: { password: true },
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
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const { username, firstName, lastName, password } = data;

    const [user, err] = await this.userService.update({
      where: { id: +userPayload.sub },
      data: { username, firstName, lastName, password },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch('archive/:id')
  async archiveSelected(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();
    if (+userPayload.sub === id) throw new ForbiddenException();

    const [user, err] = await this.userService.update({
      where: { id },
      data: { archived: true },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('archive')
  async archive(@Req() request: Request) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [user, err] = await this.userService.update({
      where: { id: +userPayload.sub },
      data: { archived: true },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch('unarchive/:id')
  async unarchiveSelected(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];

    if (!userPayload) throw new UnauthorizedException();
    if (+userPayload.sub === id) throw new ForbiddenException();

    const [user, err] = await this.userService.update({
      where: { id },
      data: { archived: false },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('unarchive')
  async unarchive(@Req() request: Request) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [user, err] = await this.userService.update({
      where: { id: +userPayload.sub },
      data: { archived: false },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Patch('approve/:id')
  async verifyUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];

    if (!userPayload) throw new UnauthorizedException();
    if (+userPayload.sub === id) throw new ForbiddenException();

    const [user, err] = await this.userService.update({
      where: { id },
      data: { verified: true },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(['ADMIN'])
  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();
    if (+userPayload.sub === id) throw new ForbiddenException();

    const [user, err] = await this.userService.delete({
      where: { id },
      omit: { password: true },
    });

    if (err) throw err;
    return user;
  }
}
