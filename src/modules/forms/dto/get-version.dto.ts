import { ApiProperty } from '@nestjs/swagger';

export class GetVersion {
    @ApiProperty()
    version: number;
}
