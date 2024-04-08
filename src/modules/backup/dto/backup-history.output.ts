import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BackupHistory } from '../entities/backup-history.entity';

@Expose()
export class GetBackupOutput extends BackupHistory {
    @ApiProperty()
    id: string;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    publicId: string;

    @ApiProperty()
    secureUrl: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    resourceType: string;

    @ApiProperty()
    bytes: number;

    @ApiProperty()
    lastMod: string;

    @Exclude()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
