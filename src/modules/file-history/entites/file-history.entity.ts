import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class FileHistory extends AppBaseEntity {
    @Column('uuid')
    rawFileId: string;

    @Column({ default: false })
    hasDeleted: boolean = false;
}
