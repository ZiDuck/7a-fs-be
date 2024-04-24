import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ImageHistoryService } from './image-history.service';
import { CreateImageHistoryDto } from './dto/create-image-history.dto';
import { UpdateImageHistoryDto } from './dto/update-image-history.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

@ApiTags('Image History')
// @ApiBearerAuth()
// @UseRoleGuard()
@Controller('image-history')
export class ImageHistoryController {
    constructor(private readonly imageHistoryService: ImageHistoryService) {}

    // @Post()
    // create(@Body() data: CreateImageHistoryDto) {
    //     return this.imageHistoryService.create(data);
    // }

    // @Get()
    // async findAll(@Query() query: PageQueryDto) {
    //     return await this.imageHistoryService.findAll(query);
    // }

    // @Get(':id')
    // async findOne(@Param('id') id: string) {
    //     return await this.imageHistoryService.findOne(id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string) {
    //     return this.imageHistoryService.update(id);
    // }

    // @Delete(':id')
    // async remove(@Param('id') id: string) {
    //     return await this.imageHistoryService.remove(id);
    // }
}
