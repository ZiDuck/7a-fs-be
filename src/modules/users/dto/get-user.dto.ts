import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { GetRoleDto } from '../../roles/dto/get-role.dto';
import { User } from '../entities/user.entity';

@Expose()
export class GetUserDto extends User {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty({
        type: GetRoleDto,
    })
    @Type(() => GetRoleDto)
    role: GetRoleDto;

    @Exclude()
    hashedPassword: string;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;

    @Exclude()
    deletedDate: Date;
}
