import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

import { DeleteImageInput } from './delete-image.input';

export class DeleteImagesInput {
    @ApiProperty()
    @ValidateNested({ each: true })
    publicIds: DeleteImageInput[];
}
