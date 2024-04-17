import { PartialType } from '@nestjs/swagger';
import { CreateFormSubmitDto } from './create-form-submit.dto';

export class UpdateFormSubmitDto extends PartialType(CreateFormSubmitDto) {}
