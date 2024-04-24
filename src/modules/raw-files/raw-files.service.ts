import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawFile } from './enitites/raw-file.entity';
import { CreateRawFileInput } from './dto/create-raw-file.input';

@Injectable()
export class RawFilesService {
    constructor(@InjectRepository(RawFile) private rawFileRepository: Repository<RawFile>) {}

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

    async remove(id: string) {
        const result = await this.rawFileRepository.findOneBy({ id });

        if (!result) throw new BadRequestException(`Không tồn tại file có id ${id}`);

        await this.rawFileRepository.remove(result);

        return true;
    }
}
