import { Connection } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { RoleType } from '../../cores/constants';

export default class InitialDatabaseSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        const roleRepository = connection.getRepository(Role);
        const userRepository = connection.getRepository(User);

        // Kiểm tra và chèn dữ liệu cho bảng Role nếu chưa tồn tại
        const existingRoles = await roleRepository.count();
        if (existingRoles === 0) {
            const roleData = [
                { value: RoleType.ADMIN, description: RoleType.ADMIN },
                { value: RoleType.USER, description: RoleType.USER },
            ];
            await roleRepository.save(roleData);
            console.log('Roles have been seeded');
        } else {
            console.log('Roles already exist, skipping seeding');
        }

        // Kiểm tra và chèn dữ liệu cho bảng User nếu chưa tồn tại
        const existingUsers = await userRepository.count();
        if (existingUsers === 0) {
            const roleAdmin = await roleRepository.findOneBy({ value: RoleType.ADMIN });
            if (roleAdmin) {
                await userRepository.save({
                    email: 'admin@gmail.com',
                    hashedPassword: '$argon2id$v=19$m=65536,t=3,p=4$yMCaLpYFhVIKhCqrjgagrg$RfqbR1NZLeDD0Tfe5koK/JqxOutyUKP8QJcg7WFz0iw', // Password is '123123'
                    firstName: 'User',
                    lastName: 'Administrator',
                    phone: '0999123145',
                    address: 'Ho Chi Minh',
                    roleId: roleAdmin.id,
                });
                console.log('User with the ADMIN role has been seeded');
            } else {
                console.log('Role ADMIN does not exist, skipping seeding user with the ADMIN role');
            }

            const roleUser = await roleRepository.findOneBy({ value: RoleType.USER });

            if (roleUser) {
                await userRepository.save({
                    email: 'user@gmail.com',
                    hashedPassword: '$argon2id$v=19$m=65536,t=3,p=4$yMCaLpYFhVIKhCqrjgagrg$RfqbR1NZLeDD0Tfe5koK/JqxOutyUKP8QJcg7WFz0iw', // Password is '123123'
                    firstName: 'User',
                    lastName: 'User',
                    phone: '0999123156',
                    address: 'Ho Chi Minh',
                    roleId: roleUser.id,
                });
                console.log('User with the USER role has been seeded');
            } else {
                console.log('Role USER does not exist, skipping seeding user with the USER role');
            }
        } else {
            console.log('Users already exist, skipping seeding');
        }
    }
}
