import { define } from 'typeorm-seeding';
import { v4 as uuid } from 'uuid';

import { User as Role } from '../../modules/users/entities/user.entity';

define(Role, () => {
    const role = new Role();

    role.id = uuid();

    return role;
});
