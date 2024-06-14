import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { RoleType } from '../../../cores/constants';
import { User } from '../../users/entities/user.entity';
import { Role } from '../entities/role.entity';

@Expose()
export class GetRoleDto extends Role {
    @ApiProperty({
        enum: RoleType,
    })
    @Type(() => String)
    value: RoleType;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;

    @Exclude()
    users: User[];
}
