import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FileHistoryService } from './file-history.service';
import { CreateFileHistoryDto } from './dto/create-file-history.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File History')
@Controller('file-history')
export class FileHistoryController {
    constructor(private readonly fileHistoryService: FileHistoryService) {}

    @Post()
    create(@Body() data: CreateFileHistoryDto) {
        return this.fileHistoryService.create(data);
    }

    @Get()
    async findAll(@Query() query: PageQueryDto) {
        return await this.fileHistoryService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.fileHistoryService.findOne(id);
    }

    // @Patch(':id')
    // update(@Param('id') id: string) {
    //     return this.fileHistoryService.update(id);
    // }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.fileHistoryService.remove(id);
    }
}
