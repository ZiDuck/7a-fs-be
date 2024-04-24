import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { ResourceType } from '../../../cores/enums/resource-type.enum';

@Entity()
export class FileHistory extends AppBaseEntity {
    @Column('uuid')
    rawFileId: string;

    @Column('enum', { enum: ResourceType })
    resourceType: ResourceType;

    @Column({ default: false })
    hasDeleted: boolean = false;
}
