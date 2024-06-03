import { Body, Controller, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteFileInput } from './dto/delete-file.input';
import { MinioClientService } from './minio-client.service';

@ApiTags('minio-client')
@Controller('minio-client')
export class MinioClientController {
    constructor(private readonly minioClientService: MinioClientService) {}

    @Delete()
    async delete(@Body() data: DeleteFileInput) {
        return await this.minioClientService.delete(data);
    }
}
