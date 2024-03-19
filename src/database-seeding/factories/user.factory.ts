import { define } from 'typeorm-seeding';
import { User } from '../../modules/users/entities/user.entity';
import { v4 as uuid } from 'uuid';

define(User, () => {
    const user = new User();

    user.id = uuid();
    user.email = 'admin@gmail.com';
    user.hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$yMCaLpYFhVIKhCqrjgagrg$RfqbR1NZLeDD0Tfe5koK/JqxOutyUKP8QJcg7WFz0iw'; // 123123
    user.firstName = 'User';
    user.lastName = 'Administrator';
    user.phone = '0999123145';
    user.address = 'Ho Chi Minh';

    return user;
});
