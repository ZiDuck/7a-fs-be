import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileHistoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rawFileId: string;
}
