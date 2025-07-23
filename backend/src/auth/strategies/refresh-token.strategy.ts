import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface RequestWithCookies extends Request {
  cookies: {
    refresh_token?: string;
  };
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookies) => {
          // Try to get token from cookies first
          const token = request?.cookies?.refresh_token;
          if (token) {
            return token;
          }

          // Fallback to Authorization header
          const authHeader = request.headers.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
          }

          return null;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-key',
      passReqToCallback: true,
    });
  }

  validate(req: RequestWithCookies, payload: any) {
    const refreshToken = req?.cookies?.refresh_token || 
      (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
        ? req.headers.authorization.substring(7) 
        : null);
    
    return {
      ...payload,
      refreshToken,
    };
  }
} 