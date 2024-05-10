import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { FormSubmit } from '../entities/form-submit.entity';
import { FormSubmitDto } from './form-submit.dto';

export class GetFormSubmit extends FormSubmit {
    @ApiProperty({
        type: FormSubmitDto,
    })
    @Exclude()
    metadata: FormSubmitDto;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
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
