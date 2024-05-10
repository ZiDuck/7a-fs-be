import { applyDecorators } from '@nestjs/common';

import { FilePublicIdExists } from '../../common/validator/file.validator';
import { ResourceType } from '../enums/resource-type.enum';

export function ImagePublicIdExists() {
    return applyDecorators(FilePublicIdExists(ResourceType.IMAGE));
}

export function RawFilePublicIdExists() {
    return applyDecorators(FilePublicIdExists(ResourceType.RAW));
}
