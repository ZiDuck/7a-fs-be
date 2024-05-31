import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { BackupService } from './backup.service';
import { GetBackupOutput } from './dto/backup-history.output';
import { CreateBackupDto } from './dto/create-backup.dto';

@ApiTags('Backup History')
// @ApiBearerAuth()
// @UseRoleGuard()
@Controller('backup')
export class BackupController {
    constructor(private readonly backupService: BackupService) {}

    @Post()
    create(@Body() createBackupDto: CreateBackupDto) {
        return this.backupService.create(createBackupDto);
    }

    @Get()
    async findAll(@Query() query: PageQueryDto) {
        const result = await this.backupService.findAll(query);

        result.items = plainToInstance(GetBackupOutput, result.items);

        return result;
    }

    //TODO: remove
    // @Get('upload')
    // backup() {
    //     return this.backupService.dataBackupService();
    // }

    // @Get(':id/download')
    // download(@Param('id') id: string) {
    //     return this.backupService.downloadFile(id);
    // }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.backupService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.backupService.remove(id);
    }
}
