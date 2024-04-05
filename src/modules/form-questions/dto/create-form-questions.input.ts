import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreateFormQuestionInput } from './create-form-question.input';
import { Type } from 'class-transformer';
import { CreateFormInput } from '../../forms/dto/create-form.input';
import { IdExists } from '../../../common/validator/uuid.validator';
import { Form } from '../../forms/entities/form.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { FormStatus } from '../../forms/enums/form-status.enum';

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
