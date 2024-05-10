import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IdExists } from 'src/common/validator/uuid.validator';

import { Role } from '../../roles/entities/role.entity';

export class DecentralizeInput {
    @ApiProperty()
    @IsNotEmpty()
    @IdExists(Role)
    roleId: string;
}
