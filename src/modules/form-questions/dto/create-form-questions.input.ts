import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import { IdExists } from '../../../common/validator/uuid.validator';
import { CreateFormInput } from '../../forms/dto/create-form.input';
import { Form } from '../../forms/entities/form.entity';
import { FormStatus } from '../../forms/enums/form-status.enum';
import { CreateFormQuestionInput } from './create-form-question.input';

export class CreateFormQuestionsInput extends CreateFormInput {
    @ApiProperty({
        type: UUID,
    })
    @IsNotEmpty()
    @IsUUID()
    @IdExists(Form)
    formId: string;

    @ApiProperty({
        enum: FormStatus,
        enumName: 'FormStatus',
    })
    @IsNotEmpty()
    @IsEnum(FormStatus)
    status: FormStatus;

    @ApiProperty({
        type: [CreateFormQuestionInput],
    })
    @Type(() => CreateFormQuestionInput)
    @ValidateNested()
    formQuestions: CreateFormQuestionInput[];
}
