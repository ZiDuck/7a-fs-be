import { ApiProperty } from '@nestjs/swagger';

export class AnswerResponseFileUpload {
    @ApiProperty()
    filename: string;

    @ApiProperty()
    publicId: string;

    @ApiProperty()
    secureUrl: string;

    @ApiProperty()
    resourceType: string;

    constructor(data: Partial<AnswerResponseFileUpload>) {
        Object.assign(this, data);
    }
}
