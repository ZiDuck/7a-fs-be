import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormCategory } from '../../forms/enums/form-category.enum';
import { FormTemplateDto } from '../dto/form-template.dto';

@Entity()
export class FormTemplate extends AppBaseEntity {
    @Column('varchar', { length: 1000, default: '' })
    title: string;

    @Column('enum', { enum: FormCategory })
    category: FormCategory;

    @Column('jsonb')
    metadata: FormTemplateDto;
}
