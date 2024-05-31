import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteFileInput } from './dto/delete-file.input';
import { MinioClientService } from './minio-client.service';

@ApiTags('minio-client')
@Controller('minio-client')
export class MinioClientController {
    constructor(private readonly minioClientService: MinioClientService) {}

    @Get()
    async findAllBucket() {
        return await this.minioClientService.listAllBuckets();
    }

    @Get(':id')
    async findOneMinioFile(@Param('id') id: string) {
        return await this.minioClientService.listAllBuckets();
    }

    @Delete()
    async delete(@Body() data: DeleteFileInput) {
        return await this.minioClientService.delete(data);
    }
}
