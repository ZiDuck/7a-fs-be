import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class LogQueryDto {
    @ApiProperty({ required: false })
    @Allow()
    status?: string;

    @ApiProperty({ required: false })
    @Allow()
    action?: string;
}
