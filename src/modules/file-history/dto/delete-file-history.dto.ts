import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { RSFilePublicIdExists } from '../../../common/validator/resource-type-file.validator';

export class DeleteFileInput {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @RSFilePublicIdExists((o: DeleteFileInput) => o.publicId)
    publicId: string;
}
