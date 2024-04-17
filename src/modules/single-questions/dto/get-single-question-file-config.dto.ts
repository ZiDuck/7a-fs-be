import { ApiProperty } from '@nestjs/swagger';

export class GetSingleQuestionFileConfig {
    @ApiProperty()
    id: string;

    @ApiProperty({
        example: '1',
        description: 'Maximum number of files that can be uploaded',
    })
    maxNumOfFiles: number;

    @ApiProperty({
        example: '10',
        description: 'Maximum file size in MB',
    })
    maxFileSize: number;
}
