import type { $Enums } from 'generated/prisma/client';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserTokenPayload = {
  sub: number;
  verified: boolean;
  role: $Enums.Role;
};
