import { PartialType } from '@nestjs/swagger';
import { CreateFormInput } from './create-form.input';

export class UpdateFormDto extends PartialType(CreateFormInput) {}
