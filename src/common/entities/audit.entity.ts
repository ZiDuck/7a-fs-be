import { Entity, Column } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity()
export class AuditEntity extends AppBaseEntity {
    @Column({ nullable: false })
    createdBy: string;

    @Column({ nullable: true })
    updatedBy: string;
}
