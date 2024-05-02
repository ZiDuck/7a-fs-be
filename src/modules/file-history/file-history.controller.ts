import { Body, Controller, Delete, Get, HttpException, InternalServerErrorException, Param, Patch, Post, Query } from '@nestjs/common';
import { FileHistoryService } from './file-history.service';
import { CreateFileHistoryDto } from './dto/create-file-history.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminUserRole } from '../../cores/decorators/role.decorator';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';

@ApiTags('File History')
@Controller('file-history')
export class FileHistoryController {
    constructor(private readonly fileHistoryService: FileHistoryService) {}

    @Post()
    async create(@Body() data: CreateFileHistoryDto) {
        try {
            return await this.fileHistoryService.create(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get()
    async findAll(@Query() query: PageQueryDto) {
        return await this.fileHistoryService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.fileHistoryService.findOne(id);
    }

    @UseRoleGuard()
    @AdminUserRole()
    @Patch(':id')
    async removeRawFileInCloud(@Param('id') id: string) {
        try {
            return await this.fileHistoryService.removeRawFileInCloud(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            return await this.fileHistoryService.removeRawFile(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
