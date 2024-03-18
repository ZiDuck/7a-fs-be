// import { Type, applyDecorators } from '@nestjs/common';
// import { ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
// import { PageQueryDto } from '../../common/dtos/page-query.dto';
// import { PageDto } from '../../common/dtos/page.dto';

// export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
//     return applyDecorators(
//         ApiExtraModels(PageDto, model),
//         ApiQuery({ type: () => PageQueryDto }),
//         ApiOkResponse({
//             description: 'Successfully received model list',
//             schema: {
//                 allOf: [
//                     { $ref: getSchemaPath(PageDto) },
//                     {
//                         properties: {
//                             items: {
//                                 type: 'array',
//                                 items: { $ref: getSchemaPath(model) },
//                             },
//                         },
//                     },
//                 ],
//             },
//         }),
//     );
// };
