import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { ResourceType } from '../../../cores/enums/resource-type.enum';

@Entity()
export class RawFile extends AppBaseEntity {
    @Column('varchar', { length: 1000, nullable: true })
    filename?: string;

    @Column('varchar', { length: 320, unique: true })
    publicId: string;

    @Column('varchar', { length: 1000 })
    url: string;

    @Column('text')
    secureUrl?: string;

    @Column('enum', { enum: ResourceType })
    resourceType: ResourceType;

    @Column('decimal', { nullable: true })
    bytes?: number;
}
