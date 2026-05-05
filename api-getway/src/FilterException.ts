/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcToHttpFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const error = exception.getError() as { status: number; message: string };
    
    const status = error.status || 500;
    const message = error.message || 'Internal server error';

    response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
    });
  }
}
