import { define } from 'typeorm-seeding';
import { User as Role } from '../../modules/users/entities/user.entity';
import { v4 as uuid } from 'uuid';

define(Role, () => {
    const role = new Role();

    role.id = uuid();

    return role;
});
