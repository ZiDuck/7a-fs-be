import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import { IdExists } from '../../../common/validator/uuid.validator';
import { Form } from '../../forms/entities/form.entity';
import { CreateFormQuestionInput } from './create-form-question.input';

export class UpdateFormQuestionDto extends CreateFormQuestionInput {
    @ApiPropertyOptional({
        type: UUID,
    })
    @IsOptional()
    @IsUUID()
    @IdExists(Form)
    id?: string;
}
