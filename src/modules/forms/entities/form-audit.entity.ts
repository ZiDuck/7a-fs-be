import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { Form } from './form.entity';

@Entity()
export class FormAudit extends AppBaseEntity {
    @Column('jsonb')
    form: Form;

    @Column('boolean', { default: false })
    isMaster: boolean;
}
