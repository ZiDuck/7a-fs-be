import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { IdExists } from '../../../common/validator/uuid.validator';
import { CreateFormQuestionInput } from '../../form-questions/dto/create-form-question.input';
import { Form } from '../entities/form.entity';
import { CreateFormInput } from './create-form.input';

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
        type: [CreateFormQuestionInput],
    })
    @Type(() => CreateFormQuestionInput)
    @ValidateNested()
    formQuestions: CreateFormQuestionInput[];
}
