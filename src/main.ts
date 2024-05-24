import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
// Load environment variables from .env file
dotenvExpand.expand(dotenv.config());

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { BusinessExceptionFilter, HttpExceptionFilter } from './common/filters/http-exception.filter';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorized-exception.filter';
import { AnswerResponseCheckbox } from './modules/form-summary/dto/answer-response-checkbox.dto';
import { AnswerResponseFileUpload } from './modules/form-summary/dto/answer-response-file-upload.dto';
import { RowResponse } from './modules/form-summary/dto/row-response.dto';

async function bootstrap() {
    initializeTransactionalContext({
        storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
    });

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: '*',
        methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH'],
        // credentials: true,
    });

    app.useGlobalFilters(
        new HttpExceptionFilter(),
        new BusinessExceptionFilter(),
        new UnauthorizedExceptionFilter(),
        // new WebsocketExceptionsFilter(),
    );

    //apply swagger
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('7a Feedback System SSR API')
        .setDescription('7a Feedback System SSR API description')
        .setVersion('1.0')
        .addTag('api')
        .build();

    // allows class-validator to use NestJS dependency injection container
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(
        new ValidationPipe({
            // transform: true,
        }),
    );

    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [AnswerResponseCheckbox, AnswerResponseFileUpload, RowResponse],
    });
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
