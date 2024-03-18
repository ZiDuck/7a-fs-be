import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenInput {
    @ApiProperty()
    refreshToken: string;
}
