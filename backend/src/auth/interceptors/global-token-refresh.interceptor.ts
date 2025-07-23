import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

interface RequestWithCookies extends Request {
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
}

@Injectable()
export class GlobalTokenRefreshInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();
    const response = context.switchToHttp().getResponse<Response>();

    // Skip auth endpoints
    if (request.url.startsWith('/auth/')) {
      return next.handle();
    }

    return next.handle().pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Clear cookies on 401
          response.clearCookie('access_token');
          response.clearCookie('refresh_token');
        }
        return throwError(() => error);
      }),
    );
  }
} 