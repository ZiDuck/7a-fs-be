import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MinioClientService } from './minio-client.service';

@ApiTags('minio-client')
@Controller('minio-client')
export class MinioClientController {
    constructor(private readonly minioClientService: MinioClientService) {}
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return await this.minioClientService.delete(id);
    }
}
