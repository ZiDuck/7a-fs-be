import { BadRequestException, Injectable } from '@nestjs/common';
import { FileHistory } from './entites/file-history.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { CreateFileHistoryDto } from './dto/create-file-history.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { RawFile } from '../raw-files/enitites/raw-file.entity';
import { paginateRaw } from '../../cores/utils/paginate.util';
import { Errors } from '../../common/errors';
import { RawFilesService } from '../raw-files/raw-files.service';
import { UpdateFileHistoryDto } from './dto/update-file-history.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Transactional } from 'typeorm-transactional';
import { GetFileHistoryQuery } from './dto/get-file-history-query.dto';

@Injectable()
export class FileHistoryService {
    constructor(
        @InjectRepository(FileHistory) private fileHistoryRepository: Repository<FileHistory>,
        @InjectDataSource() private dataSource: DataSource,
        private rawFileService: RawFilesService,
        private cloudinaryService: CloudinaryService,
    ) {}

    async create(data: CreateFileHistoryDto) {
        const rawFile = await this.rawFileService.getById(data.rawFileId);

        const image = this.fileHistoryRepository.create({
            ...data,
            resourceType: rawFile.resourceType,
        });

        const result = await this.fileHistoryRepository.save(image);

        return result ? true : false;
    }

    async findAll(query: PageQueryDto) {
        const builder = this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('history.rawFileId', 'rawFileId')
            .addSelect('file.publicId', 'publicId')
            .addSelect('file.secureUrl', 'secureUrl')
            .addSelect('file.fileName', 'fileName')
            .addSelect('file.resourceType', 'resourceType')
            .addSelect('file.bytes', 'bytes')
            .from(FileHistory, 'history')
            .addFrom(RawFile, 'file')
            .where('file.id=history.rawFileId')
            .orderBy('history.updatedDate', 'DESC');

        const result = await paginateRaw(builder, query);

        return result;
    }

    async findAllNotPaginate(condition: GetFileHistoryQuery) {
        const result = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('history.rawFileId', 'rawFileId')
            .addSelect('file.publicId', 'publicId')
            .addSelect('file.secureUrl', 'secureUrl')
            .addSelect('file.fileName', 'fileName')
            .addSelect('file.resourceType', 'resourceType')
            .addSelect('file.bytes', 'bytes')
            .from(FileHistory, 'history')
            .addFrom(RawFile, 'file')
            .where('file.id=history.rawFileId')
            .andWhere('history.createdDate BETWEEN :startDate AND :endDate', { startDate: condition.startDate, endDate: condition.endDate })
            .orderBy('history.updatedDate', 'DESC')
            .getRawMany();

        return result;
    }

    async findAllHasNotDeletedAndNotPaginate(condition: GetFileHistoryQuery) {
        const result = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('history.rawFileId', 'rawFileId')
            .addSelect('file.publicId', 'publicId')
            .addSelect('file.secureUrl', 'secureUrl')
            .addSelect('file.fileName', 'fileName')
            .addSelect('file.resourceType', 'resourceType')
            .addSelect('file.bytes', 'bytes')
            .from(FileHistory, 'history')
            .addFrom(RawFile, 'file')
            .where('file.id=history.rawFileId')
            .andWhere('history.createdDate BETWEEN :startDate AND :endDate', { startDate: condition.startDate, endDate: condition.endDate })
            .andWhere('history.hasDeleted=false')
            .orderBy('history.updatedDate', 'DESC')
            .getRawMany();

        return result;
    }

    async findAllHasDeleted(condition: GetFileHistoryQuery) {
        const results = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('history.rawFileId', 'rawFileId')
            .from(FileHistory, 'history')
            .where('history.hasDeleted = :hasDeleted', { hasDeleted: true })
            .andWhere('(history.createdDate >= :startDate OR :startDate IS NULL)', { startDate: condition.startDate })
            .andWhere('(history.createdDate <= :endDate OR :endDate IS NULL)', { endDate: condition.endDate })
            .getRawMany();

        return results;
    }

    async findOne(id: string) {
        const builder = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('history.rawFileId', 'rawFileId')
            .addSelect('file.publicId', 'publicId')
            .addSelect('file.secureUrl', 'secureUrl')
            .addSelect('file.fileName', 'fileName')
            .addSelect('file.resourceType', 'resourceType')
            .addSelect('file.bytes', 'bytes')
            .from(FileHistory, 'history')
            .addFrom(RawFile, 'file')
            .where('file.id=history.rawFileId')
            .andWhere('history.id=:id', { id })
            .getRawOne();

        return builder;
    }

    async findOneHasDeleted(id: string) {
        const result = await this.fileHistoryRepository.findOne({
            where: {
                id,
            },
        });

        if (!result) {
            throw Errors.FileNotFoundErrorBusiness(id);
        }

        if (!result.hasDeleted) throw new BadRequestException(`File có id ${id} chưa được xóa trên cloudinary!`);

        return result;
    }

    async findOneHasNotDeleted(id: string) {
        const result = await this.dataSource
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

        if (!result) {
            throw Errors.FileNotFoundErrorBusiness(id);
        }

        return result;
    }

    async update(id: string, data: UpdateFileHistoryDto) {
        const imageHistory = await this.findOneHasNotDeleted(id);

        if (!imageHistory) {
            throw Errors.ImageHistoryNotFoundErrorBusiness(id);
        }

        await this.fileHistoryRepository.save({
            ...imageHistory,
            ...data,
        });

        return true;
    }

    @Transactional()
    async removeRawFileInCloud(id: string) {
        const imageHistory = await this.findOne(id);

        if (!imageHistory) {
            throw Errors.FileNotFoundErrorBusiness(id);
        }

        // Kiểm tra file đã tồn tại trong cloudinary chưa
        const isFileExisted: boolean = await this.cloudinaryService.checkResourcesExists({
            publicId: imageHistory.publicId,
            resourceType: imageHistory.resourceType,
        });

        if (!isFileExisted) throw Errors.FileNotFoundInCloudinaryErrorBusiness(id);

        // Xóa file trên cloudinary
        const isFileDeleted = await this.cloudinaryService.deleteResources([imageHistory.publicId], imageHistory.resourceType);

        if (!isFileDeleted) throw Errors.FileNotDeletedInCloudinaryErrorBusiness(id);

        // Cập nhật trạng thái đã xóa của file
        await this.update(id, { hasDeleted: true });

        return true;
    }

    @Transactional()
    async removeRawFile(id: string) {
        const fileExists = await this.findOneHasDeleted(id);

        await this.rawFileService.remove(fileExists.rawFileId);

        await this.fileHistoryRepository.remove(fileExists);

        return true;
    }

    @Transactional()
    async removeRawFiles(condition: GetFileHistoryQuery) {
        const fileExists = await this.findAllHasDeleted(condition);

        await this.rawFileService.removeMany(fileExists.map((item) => item.rawFileId));

        await this.fileHistoryRepository.remove(fileExists);

        return true;
    }

    // async remove(id: string) {
    //     await this.fileHistoryRepository.delete(id);

    //     return true;
    // }
}
