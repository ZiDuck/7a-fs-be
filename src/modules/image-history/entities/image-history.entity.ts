import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';

@Entity()
export class ImageHistory extends AppBaseEntity {
    @Column('uuid')
    imageId: string;

    @Column({ default: false })
    hasDeleted: boolean = false;
}
