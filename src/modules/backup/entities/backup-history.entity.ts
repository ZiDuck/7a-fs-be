import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class BackupHistory extends AppBaseEntity {
    @Column('varchar', { length: 100, nullable: true })
    name: string;

    @Column('varchar', { length: 100, nullable: true })
    path: string;

    @Column('decimal', { nullable: true })
    size?: number;

    @Column('varchar', { length: 100, nullable: true })
    lastMod: string;
}
