import { ApiProperty } from '@nestjs/swagger';

class GetUserCreatedLog {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    fullName: string;
}
export class LogResult {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    userId: string;

    @ApiProperty({ type: String })
    message: string;

    @ApiProperty({ type: String })
    ipAddress: string;

    @ApiProperty({ type: String })
    userAgent: string;

    @ApiProperty({ type: String })
    path: string;

    @ApiProperty({ type: Number })
    httpStatusCode: number;

    @ApiProperty({ type: String })
    actionStatus: string;

    @ApiProperty({ type: String })
    logTime: Date;

    @ApiProperty({ type: GetUserCreatedLog })
    user: GetUserCreatedLog;
}
