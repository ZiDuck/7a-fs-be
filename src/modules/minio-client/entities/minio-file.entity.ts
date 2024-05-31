import { Column, Entity, PrimaryColumn } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class MinioFile extends AppBaseEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('varchar', { length: 1000, nullable: true })
    pathFile?: string;

    @Column('varchar', { length: 1000, nullable: true })
    mimetype?: string;

    @Column('decimal', { nullable: true })
    bytes?: number;

    @Column('varchar', { length: 100, nullable: true })
    lastMod?: string;
}
