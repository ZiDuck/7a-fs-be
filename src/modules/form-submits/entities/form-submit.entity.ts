import { plainToInstance } from 'class-transformer';
import { Column, Entity, ValueTransformer } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormSubmitDto } from '../dto/form-submit.dto';

class FormSubmitTransformer implements ValueTransformer {
    to(value) {
        return value;
    }
    from(value) {
        return plainToInstance(FormSubmitDto, value);
    }
}

@Entity()
export class FormSubmit extends AppBaseEntity {
    @Column({
        type: 'jsonb',
        transformer: new FormSubmitTransformer(),
    })
    metadata: FormSubmitDto;
}
