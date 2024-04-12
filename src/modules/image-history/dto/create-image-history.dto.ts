import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageHistoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    imageId: string;
}
