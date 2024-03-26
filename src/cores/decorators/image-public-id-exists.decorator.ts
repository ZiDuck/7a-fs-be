import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { FilePublicIdExists } from '../../common/validator/file.validator';
import { ResourceType } from '../enums/resource-type.enum';

export function ImagePublicIdExists() {
    return applyDecorators(FilePublicIdExists(ResourceType.IMAGE));
}
