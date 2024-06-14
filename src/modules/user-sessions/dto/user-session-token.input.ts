import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserSessionInput {
    @ApiProperty({
        type: String,
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    userId: string;
}

export class UpdateUserSessionInput extends CreateUserSessionInput {
    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    oldRefreshToken: string;
}

export class DeleteUserSessionInput extends CreateUserSessionInput {}
