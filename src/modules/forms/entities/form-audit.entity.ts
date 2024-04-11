import { Column, Entity } from 'typeorm';
import { Form } from './form.entity';
import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class FormAudit extends AppBaseEntity {
    @Column('jsonb')
    form: Form;

    @Column('boolean', { default: false })
    isMaster: boolean;
}
