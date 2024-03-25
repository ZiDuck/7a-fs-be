import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import { IsNotEmpty } from 'class-validator';
import { IdExists } from 'src/common/validator/uuid.validator';

export class DecentralizeInput {
    @ApiProperty()
    @IsNotEmpty()
    @IdExists(Role)
    roleId: string;
}
