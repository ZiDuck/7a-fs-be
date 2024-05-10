import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { FormStatus } from '../enums/form-status.enum';

export class UpdateFormStatusDto {
    @ApiProperty({
        enum: FormStatus,
        enumName: 'FormStatus',
    })
    @IsNotEmpty()
    @IsEnum(FormStatus, {
        message: `status phải là một trong các giá trị sau: ${Object.values(FormStatus).join(', ')}`,
    })
    status: FormStatus;
}
