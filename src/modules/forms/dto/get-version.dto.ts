import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetVersion {
    @ApiProperty()
    @Type(() => Number)
    version: number;
}
