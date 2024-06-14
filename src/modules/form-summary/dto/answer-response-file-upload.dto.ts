import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerResponseFileUpload {
    @ApiProperty()
    bytes: number;

    @ApiProperty()
    filename?: string;

    @ApiProperty()
    secureUrl: string;

    @ApiPropertyOptional()
    mimetype?: string;

    constructor(data: Partial<AnswerResponseFileUpload>) {
        Object.assign(this, data);
    }
}
