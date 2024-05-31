import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { env } from '../../cores/utils/env.util';
import { MinioClientService } from '../minio-client/minio-client.service';
import { CreateRawFileInput } from './dto/create-raw-file.input';
import { RawFile } from './enitites/raw-file.entity';

@Injectable()
export class RawFilesService {
    constructor(
        @InjectRepository(RawFile) private rawFileRepository: Repository<RawFile>,
        private readonly minioClientService: MinioClientService,
    ) {}

    async create(data: CreateRawFileInput) {
        const result = this.rawFileRepository.create(data);

        await this.rawFileRepository.save(result);

        return result;
    }

    async getById(id: string) {
        const result = await this.rawFileRepository.findOneBy({ id });

        if (!result) throw new BadRequestException(`Không tồn tại file có id ${id}`);

        return result;
    }

    async checkFileHook(id: string) {
        const file = await this.minioClientService.findById(id);

        if (!file) return null;

        return {
            id: file.id,
            pathFile: file.pathFile,
            secureUrl: `http://${env.String('MINIO_ENDPOINT')}:${env.Int('MINIO_PORT', 9000)}/${env.String('MINIO_BUCKET')}/${file.pathFile}`,
        };
    }

    async remove(id: string) {
        const result = await this.rawFileRepository.findOneBy({ id });

        if (!result) throw new BadRequestException(`Không tồn tại file có id ${id}`);

        await this.rawFileRepository.remove(result);

        return true;
    }

    async removeMany(ids: string[]) {
        // const result = await this.rawFileRepository.findOneBy({ id });

        if (ids.length === 0) return true;

        await this.rawFileRepository.delete(ids);

        return true;
    }
}
