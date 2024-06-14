import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Role extends AppBaseEntity {
    @Column('varchar', { length: 100, unique: true })
    value: string;

    @Column('varchar', { length: 1000 })
    description: string;

    @OneToMany(() => User, (user: User) => user.role)
    users: Relation<User>[];
}
