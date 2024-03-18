import { CreateDateColumn, Entity, UpdateDateColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';

@Entity()
export class AuditEntity extends TypeOrmBaseEntity {
    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
