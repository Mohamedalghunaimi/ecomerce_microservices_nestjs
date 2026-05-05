/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcToHttpFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('Exception => ', exception);

    const error = exception?.response || exception;

    const status = error?.status || 500;
    const message = error?.message || 'Internal server error';

    response.status(status as number).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}