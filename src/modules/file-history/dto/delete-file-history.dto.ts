import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { RSFilePublicIdExists } from '../../../common/validator/resource-type-file.validator';

export class DeleteFileInput {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @RSFilePublicIdExists((o: DeleteFileInput) => o.publicId)
    publicId: string;
}
