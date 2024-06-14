import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { CreateUserInput } from './create-user.input';

export class UpdateUserInput extends OmitType(CreateUserInput, ['password'] as const) {
    @Exclude()
    password: string;
}
