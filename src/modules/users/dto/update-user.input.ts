import { OmitType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.input';
import { Exclude } from 'class-transformer';

export class UpdateUserInput extends OmitType(CreateUserInput, ['password'] as const) {
    @Exclude()
    password: string;
}
