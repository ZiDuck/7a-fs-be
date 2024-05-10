import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response as ExpressResponse } from 'express';

import { BusinessException } from '../exceptions/business.exception';
import { HttpExceptionResponse } from './interface/exception-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const res = ctx.getResponse<ExpressResponse>();
        const request = ctx.getRequest();
        const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse: HttpExceptionResponse = exception.getResponse() as HttpExceptionResponse;
        const errorBody: HttpExceptionResponse = {
            statusCode: status,
            error: exception.name,
            path: request.url,
            timestamps: new Date().toISOString(),
            trace: exception.stack,
        };

        if (Array.isArray(exceptionResponse.message)) {
            Reflect.set(errorBody, 'messages', exceptionResponse.message);
        } else {
            Reflect.set(errorBody, 'message', exceptionResponse.message);
        }

        return res.status(status).json(errorBody);
    }
}
@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
    catch(exception: BusinessException, host: ArgumentsHost) {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const res = ctx.getResponse<ExpressResponse>();
        const request = ctx.getRequest();
        const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse: HttpExceptionResponse = exception.getResponse() as HttpExceptionResponse;
        const errorBody: HttpExceptionResponse = {
            statusCode: status,
            error: exception.name,
            path: request.url,
            timestamps: new Date().toISOString(),
            data: exception.getData(),
        };

        if (Array.isArray(exceptionResponse.message)) {
            Reflect.set(errorBody, 'messages', exceptionResponse.message);
        } else {
            Reflect.set(errorBody, 'message', exceptionResponse.message);
        }

        return res.status(status).json(errorBody);
    }
}
