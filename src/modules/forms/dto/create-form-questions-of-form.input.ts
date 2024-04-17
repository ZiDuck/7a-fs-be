import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFormInput } from '../../forms/dto/create-form.input';
import { IdExists } from '../../../common/validator/uuid.validator';
import { Form } from '../../forms/entities/form.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { FormStatus } from '../../forms/enums/form-status.enum';
import {
    CreateFormQuestionInput,
    CreateGroupQuestionFormInput,
    CreateSingleQuestionFormInput,
} from '../../form-questions/dto/create-form-question.input';
import { SINGLE_QUESTION_TYPES, GROUP_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';

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
