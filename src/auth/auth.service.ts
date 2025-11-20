import type { User } from 'generated/prisma/client';
import type { ReturnWithErrPromise } from 'src/common/type/return-with-err.type';
import type { Tokens, UserTokenPayload } from 'src/token/type/token.type';

import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { exceptionHandler } from 'src/common/helper/exception-handler.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async signUp({
    username,
    password,
    firstName,
    lastName,
  }: CreateUserDto): ReturnWithErrPromise<Tokens> {
    try {
      const [user, err] = await this.userService.create({
        username,
        password,
        firstName,
        lastName,
      });

      if (err) {
        if (err.getStatus() === 409) {
          throw new ConflictException('User already exists');
        }

        throw err;
      }

      const [token, tokenErr] = await this.createTokens(user);
      if (tokenErr) throw tokenErr;

      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signIn({
    username,
    password,
  }: SignInDto): ReturnWithErrPromise<Tokens> {
    try {
      const [user, err] = await this.userService.findOne(
        { username: username },
        true,
      );
      if (err) throw err;

      const isPasswordCorrect = await compare(password, user.password);
      if (!isPasswordCorrect) throw new BadRequestException('Wrong password');

      const [token, tokenErr] = await this.createTokens(user);
      if (tokenErr) throw tokenErr;
      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async signOut({ refreshToken }: SignOutDto): Promise<void | HttpException> {
    try {
      const [_, tokenErr] =
        await this.tokenService.verifyRefreshToken(refreshToken);
      if (tokenErr) throw tokenErr;

      const [__, deleteErr] = await this.tokenService.delete(refreshToken);
      if (deleteErr) throw deleteErr;
    } catch (err) {
      const error =
        err instanceof HttpException ? err : new InternalServerErrorException();
      return error;
    }
  }

  async signOutEverywhere({
    refreshToken,
  }: SignOutDto): Promise<void | HttpException> {
    try {
      const [token, err] =
        await this.tokenService.verifyRefreshToken(refreshToken);
      if (err) throw err;

      const userData = {
        id: +token.sub,
        role: token.role,
      };

      const [_, deleteErr] = await this.tokenService.deleteAllUsersToken(
        userData.id,
      );
      if (deleteErr) throw deleteErr;
    } catch (err) {
      const error =
        err instanceof HttpException ? err : new InternalServerErrorException();
      return error;
    }
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): ReturnWithErrPromise<Tokens> {
    try {
      const [_, verifyErr] =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (verifyErr) throw verifyErr;

      const [deletedToken, deleteErr] =
        await this.tokenService.delete(refreshToken);
      if (deleteErr) throw deleteErr;

      const [token, tokenErr] = await this.createTokens(deletedToken.user);
      if (tokenErr) throw tokenErr;

      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private async createTokens(
    user: Omit<User, 'password'>,
  ): ReturnWithErrPromise<Tokens> {
    const payload: UserTokenPayload = {
      sub: user.id,
      verified: user.verified,
      role: user.role,
    };

    const [token, tokenErr] = this.tokenService.generate(payload);
    if (tokenErr) return [null, tokenErr];

    const [_, saveTokenErr] = await this.tokenService.save(
      user.id,
      token.refreshToken,
    );
    if (saveTokenErr) return [null, saveTokenErr];

    return [token, null];
  }
}
