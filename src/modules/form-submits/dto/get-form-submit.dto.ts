import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { FormSubmit } from '../entities/form-submit.entity';
import { FormSubmitDto } from './form-submit.dto';

export class GetFormSubmit extends FormSubmitDto {
    @ApiProperty()
    formSubmitId: string;

    @ApiProperty()
    correctPoint: number;
}

export class GetFormSubmitDetail extends FormSubmit {
    @ApiProperty({
        type: FormSubmitDto,
    })
    metadata: FormSubmitDto;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
