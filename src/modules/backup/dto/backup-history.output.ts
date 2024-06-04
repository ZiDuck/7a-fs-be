import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { BackupHistory } from '../entities/backup-history.entity';

@Expose()
export class GetBackupOutput extends BackupHistory {
    @ApiProperty()
    id: string;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    pathFile: string;

    @ApiProperty()
    secureUrl: string;

    @ApiProperty()
    mimetype: string;

    @ApiProperty()
    bytes: number;

    @ApiProperty()
    lastMod: string;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
