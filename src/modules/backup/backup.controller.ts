import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { BackupService } from './backup.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { plainToInstance } from 'class-transformer';
import { GetBackupOutput } from './dto/backup-history.output';

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

    @Get('upload')
    backup() {
        return this.backupService.dataBackupService();
    }

    @Get(':id/download')
    download(@Param('id') id: string) {
        return this.backupService.downloadFile(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.backupService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.backupService.remove(id);
    }
}
