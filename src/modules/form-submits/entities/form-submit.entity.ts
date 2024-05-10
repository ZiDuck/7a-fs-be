import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormSubmitDto } from '../dto/form-submit.dto';

@Entity()
export class FormSubmit extends AppBaseEntity {
    @Column('jsonb')
    metadata: FormSubmitDto;
}
