import { Entity, Column, DeleteDateColumn, OneToMany, JoinColumn, ManyToOne, Relation, OneToOne } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { UserSession } from '../../user-sessions/entities/user-session.entity';

@Entity()
export class User extends AppBaseEntity {
    @Column('varchar', { length: 320, unique: true })
    email: string;

    @Column('varchar', { length: 4096 })
    hashedPassword: string;

    @Column('varchar', { length: 100 })
    firstName: string;

    @Column('varchar', { length: 100 })
    lastName: string;

    @Column('varchar', { length: 15 })
    phone: string;

    @Column('varchar', { length: 2000 })
    address: string;

    @DeleteDateColumn()
    deletedDate: Date;

    @OneToMany(() => UserSession, (userSession: UserSession) => userSession.user)
    userSessions: UserSession[];

    @Column('uuid')
    roleId: Relation<Role>['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'roleId' })
    @ManyToOne(() => Role, (role: Role) => role.users)
    role: Relation<Role>;

    public getName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
