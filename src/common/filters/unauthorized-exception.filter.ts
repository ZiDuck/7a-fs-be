import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response as ExpressResponse } from 'express';

import { ExceptionResponse } from './interface/exception-response.interface';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const res = ctx.getResponse<ExpressResponse>();
        const request = ctx.getRequest();
        const status = HttpStatus.UNAUTHORIZED;

        const exceptionResponse: ExceptionResponse = exception.getResponse() as ExceptionResponse;

        const errorBody: ExceptionResponse = {
            statusCode: status,
            error: exception.name,
            path: request.url,
            timestamps: new Date().toISOString(),
        };

        if (Array.isArray(exceptionResponse.message)) {
            Reflect.set(errorBody, 'messages', exceptionResponse.message);
        } else {
            Reflect.set(errorBody, 'message', exceptionResponse.message);
        }

        return res.status(status).json(errorBody);
    }
}
