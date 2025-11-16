import type { Request } from 'express';
import type { UserTokenPayload } from 'src/token/type/token.type';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMany() {
    const [users, err] = await this.userService.findMany();
    if (err) throw err;
    return users;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findMe(@Req() request: Request) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [user, err] = await this.userService.findOne({
      id: +userPayload.sub,
    });

    if (err) throw err;
    return user;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [user, err] = await this.userService.findOne({ id });
    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [user, err] = await this.userService.update(
      { id: +userPayload.sub },
      updateUserDto,
    );

    if (err) throw err;
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('archive')
  async arcive(@Req() request: Request) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [user, err] = await this.userService.archive({
      id: +userPayload.sub,
    });
    if (err) throw err;

    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('unarchive')
  async unarchive(@Req() request: Request) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [user, err] = await this.userService.unarchive({
      id: +userPayload.sub,
    });
    if (err) throw err;

    return user;
  }
}
