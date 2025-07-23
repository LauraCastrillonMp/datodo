import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BlacklistedToken } from '@prisma/client';
import { JwtPayload } from './auth.service';

@Injectable()
export class TokenBlacklistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async addToBlacklist(token: string): Promise<BlacklistedToken> {
    const decoded = (await this.jwtService.decode(token)) as JwtPayload & { exp: number };
    const expiresAt = new Date(decoded.exp * 1000);

    return await this.prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt,
      },
    });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
      where: { token },
    });

    return !!blacklistedToken;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
} 