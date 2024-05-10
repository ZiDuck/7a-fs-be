import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation, UpdateDateColumn } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserSession extends AppBaseEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('varchar', { length: 1000, nullable: true })
    @PrimaryColumn()
    refreshToken: string;

    @PrimaryColumn()
    userId: string;

    @ManyToOne(() => User, (user: User) => user.userSessions)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: Relation<User>;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
