import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import { IdExists } from '../../../common/validator/uuid.validator';
import {
    CreateFormQuestionInput,
    CreateGroupQuestionFormInput,
    CreateSingleQuestionFormInput,
} from '../../form-questions/dto/create-form-question.input';
import { GROUP_QUESTION_TYPES, SINGLE_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';
import { CreateFormInput } from '../../forms/dto/create-form.input';
import { Form } from '../../forms/entities/form.entity';
import { FormStatus } from '../../forms/enums/form-status.enum';

export class CreateFormQuestionOfFormInput extends CreateFormInput {
    @ApiProperty({
        type: UUID,
    })
    @IsNotEmpty()
    @IsUUID()
    @IdExists(Form)
    id: string;

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
    // @Type(() => CreateFormQuestionInput)
    @Type(() => CreateFormQuestionInput, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'attributeType',
            subTypes: [
                ...SINGLE_QUESTION_TYPES.map((value) => ({ value: CreateSingleQuestionFormInput, name: value })),
                ...GROUP_QUESTION_TYPES.map((value) => ({ value: CreateGroupQuestionFormInput, name: value })),
            ],
        },
    })
    @ValidateNested()
    formQuestions: CreateFormQuestionInput[];
}
