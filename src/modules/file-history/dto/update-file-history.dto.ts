import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateFileHistoryDto {
    @ApiPropertyOptional()
    @IsBoolean()
    hasDeleted?: boolean;
}
