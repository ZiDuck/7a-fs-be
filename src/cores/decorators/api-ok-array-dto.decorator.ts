import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkArrayResponseDto = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiExtraModels(model),
        ApiOkResponse({
            description: 'Successfully received model list',
            schema: {
                allOf: [{ $ref: getSchemaPath(model) }],
            },
            isArray: true,
        }),
    );
};
