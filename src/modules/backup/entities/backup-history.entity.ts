import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class BackupHistory extends AppBaseEntity {
    @Column('varchar', { length: 1000, nullable: true })
    filename?: string;

    @Column('varchar', { length: 1000, nullable: true })
    pathFile: string;

    @Column('varchar', { length: 1000, nullable: true })
    mimetype?: string;

    @Column('decimal', { nullable: true })
    bytes?: number;

    @Column('varchar', { length: 100, nullable: true })
    lastMod?: string;
}
