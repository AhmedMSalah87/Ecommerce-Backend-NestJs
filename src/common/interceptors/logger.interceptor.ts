import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`${method} ${url} - ${duration}ms`);
      }),
    );
  }
}
