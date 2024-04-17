import { Entity, Column } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';

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

    @Column('varchar', { length: 100, nullable: true })
    resourceType: string;

    @Column('decimal', { nullable: true })
    bytes?: number;
}
