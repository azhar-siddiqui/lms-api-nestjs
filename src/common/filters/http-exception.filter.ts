import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message:
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
