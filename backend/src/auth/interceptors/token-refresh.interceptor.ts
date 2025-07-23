import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

interface RequestWithCookies extends Request {
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
}

@Injectable()
export class TokenRefreshInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      catchError((error) => {
        // Only handle 401 Unauthorized errors
        if (error.status === 401) {
          const refreshToken = request.cookies?.refresh_token;
          
          if (!refreshToken) {
            return throwError(() => new UnauthorizedException('No refresh token available'));
          }

          // Try to refresh the token
          return this.refreshTokenAndRetry(request, response, refreshToken, next);
        }

        return throwError(() => error);
      }),
    );
  }

  private async refreshTokenAndRetry(
    request: RequestWithCookies,
    response: Response,
    refreshToken: string,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      });

      // Generate new tokens
      const tokens = await this.authService.getTokens(
        payload.sub,
        payload.username,
        payload.role,
      );

      // Set new cookies
      response.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 5 * 60 * 1000, // 5 minutes
      });

      response.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 3600000, // 7 days
      });

      // Update the request with the new access token
      request.cookies.access_token = tokens.accessToken;

      // Retry the original request
      return next.handle();
    } catch (error) {
      // If refresh fails, clear cookies and throw unauthorized
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');
      return throwError(() => new UnauthorizedException('Token refresh failed'));
    }
  }
} 