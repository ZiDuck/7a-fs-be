import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

@Entity()
export class ForgottenPassword extends AppBaseEntity {
    @Column('varchar', { length: 320, unique: true })
    email: string;

    @Column('varchar', { length: 50 })
    newPasswordToken: string;

    @Column('timestamp', { nullable: true })
    expiredDate: Date;

    @Column('uuid')
    userId: string;

    @OneToOne(() => User)
    @JoinColumn({ referencedColumnName: 'id', name: 'userId' })
    user: User;
}
