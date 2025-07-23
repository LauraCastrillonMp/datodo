import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';
import { TokenBlacklistService } from '../token-blacklist.service';
import { Request } from 'express';

interface RequestWithCookies extends Request {
  cookies: {
    access_token?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookies) => {
          // Try to get token from cookies
          const token = request?.cookies?.access_token;
          if (token) return token;

          // Try to get token from Authorization header
          const authHeader = request.headers.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload, req: RequestWithCookies) {
    // Get the actual token from the request for blacklist check
    const token =
      req?.cookies?.access_token ||
      (req?.headers?.authorization &&
      req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.substring(7)
        : null);

    if (token) {
      const isBlacklisted =
        await this.tokenBlacklistService.isBlacklisted(token);

      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been blacklisted');
      }
    }

    const user = await this.authService.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }
}
