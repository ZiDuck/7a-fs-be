import { PartialType } from '@nestjs/swagger';
import { CreateFormQuestionInput } from './create-form-question.input';

export class UpdateFormQuestionDto extends PartialType(CreateFormQuestionInput) {}
