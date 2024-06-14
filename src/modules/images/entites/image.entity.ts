import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class Image extends AppBaseEntity {
    @Column('varchar', { length: 320, unique: true })
    publicId: string;

    @Column('varchar', { length: 1000 })
    url: string;

    @Column('varchar', { length: 1000, nullable: true })
    filename?: string;

    @Column('text', { nullable: true })
    secureUrl?: string;

    @Column('decimal', { nullable: true })
    bytes?: number;
}
