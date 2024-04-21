import { Injectable } from '@nestjs/common';
import { FileHistory } from './entites/file-history.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateFileHistoryDto } from './dto/create-file-history.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { RawFile } from '../raw-files/enitites/raw-file.entity';
import { paginateRaw } from '../../cores/utils/paginate.util';
import { Errors } from '../../common/errors';

@Injectable()
export class FileHistoryService {
    constructor(
        @InjectRepository(FileHistory) private fileHistoryRepository: Repository<FileHistory>,
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async create(data: CreateFileHistoryDto) {
        const image = this.fileHistoryRepository.create(data);

        const result = await this.fileHistoryRepository.save(image);

        return result ? true : false;
    }

    async findAll(query: PageQueryDto) {
        const builder = this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('history.rawFileId', 'rawFileId')
            .addSelect('file.url', 'url')
            .addSelect('file.publicId', 'publicId')
            .addSelect('file.secureUrl', 'secureUrl')
            .from(FileHistory, 'history')
            .addFrom(RawFile, 'file')
            .where('file.id=history.rawFileId')
            .orderBy('history.createdDate', 'DESC');

        const result = await paginateRaw(builder, query);

        return result;
    }

    async findOne(id: string) {
        const builder = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('file.publicId', 'publicId')
            .from(FileHistory, 'history')
            .addFrom(RawFile, 'file')
            .where('file.id=history.rawFileId')
            .andWhere('history.id=:id', { id })
            .orderBy('history.createdDate', 'DESC')
            .getRawOne();

        return builder;
    }

    async findOneHasDeleted(id: string) {
        const result = await this.fileHistoryRepository.findOne({
            where: {
                id,
                hasDeleted: true,
            },
        });

        if (!result) {
            throw Errors.FileNotFoundErrorBusiness(id);
        }

        return result;
    }

    async findOneHasNotDeleted(id: string) {
        const result = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('image.publicId', 'publicId')
            .from(FileHistory, 'history')
            .addFrom(RawFile, 'file')
            .where('file.id=history.rawFileId')
            .andWhere('history.id=:id', { id })
            .orderBy('history.createdDate', 'DESC')
            .getRawOne();

        if (!result) {
            throw Errors.FileNotFoundErrorBusiness(id);
        }

        return result;
    }

    async remove(id: string) {
        const imageExists = await this.findOneHasDeleted(id);

        const result = await this.fileHistoryRepository.remove(imageExists);

        return result;
    }
}
