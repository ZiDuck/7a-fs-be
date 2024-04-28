import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { IdExists } from '../../../common/validator/uuid.validator';
import { CreateGroupQuestionFormInput, CreateSingleQuestionFormInput } from '../../form-questions/dto/create-form-question.input';
import { Form } from '../entities/form.entity';
import { CreateFormInput } from './create-form.input';
import { UpdateFormQuestionDto } from '../../form-questions/dto/update-form-question.dto';
import { SINGLE_QUESTION_TYPES, GROUP_QUESTION_TYPES } from '../../form-questions/enums/attribute-type.enum';
import { FormStatus } from '../enums/form-status.enum';

export class UpdateFormQuestionOfFormInput extends CreateFormInput {
    @ApiProperty({
        type: UUID,
    })
    @IsNotEmpty()
    @IsUUID()
    @IdExists(Form)
    id: string;

    @ApiProperty({
        type: Number,
    })
    @IsOptional()
    @IsInt()
    version?: number;

    @ApiProperty({
        enum: FormStatus,
    })
    status: FormStatus;

    @ApiProperty({
        type: [UpdateFormQuestionDto],
    })
    @Type(() => UpdateFormQuestionDto, {
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
    formQuestions: UpdateFormQuestionDto[];
}
