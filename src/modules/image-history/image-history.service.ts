import { Injectable } from '@nestjs/common';
import { CreateImageHistoryDto } from './dto/create-image-history.dto';
import { ImageHistory } from './entities/image-history.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Image } from '../images/entites/image.entity';
import { paginateRaw } from '../../cores/utils/paginate.util';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { Errors } from '../../common/errors';
import { DeleteImageInput } from '../images/dto/delete-image.input';
import { validate } from 'class-validator';

@Injectable()
export class ImageHistoryService {
    constructor(
        @InjectRepository(ImageHistory) private imageHistoryRepository: Repository<ImageHistory>,
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async create(data: CreateImageHistoryDto) {
        const image = this.imageHistoryRepository.create(data);

        const result = await this.imageHistoryRepository.save(image);

        return result ? true : false;
    }

    async findAll(query: PageQueryDto) {
        const builder = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('history.imageId', 'imageId')
            .addSelect('image.url', 'url')
            .addSelect('image.publicId', 'publicId')
            .from(ImageHistory, 'history')
            .addFrom(Image, 'image')
            .where('image.id=history.imageId')
            .orderBy('history.createdDate', 'DESC');

        const result = await paginateRaw(builder, query);

        return result;
    }

    async findOne(id: string) {
        const builder = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('image.publicId', 'publicId')
            .from(ImageHistory, 'history')
            .addFrom(Image, 'image')
            .where('image.id=history.imageId')
            .andWhere('history.id=:id', { id })
            .orderBy('history.createdDate', 'DESC')
            .getRawOne();

        return builder;
    }

    async findOneHasDeleted(id: string) {
        const result = await this.imageHistoryRepository.findOne({
            where: {
                id,
                hasDeleted: true,
            },
        });

        if (!result) {
            throw Errors.ImageHistoryNotFoundErrorBusiness(id);
        }

        return result;
    }

    async findOneHasNotDeleted(id: string) {
        const result = await this.dataSource
            .createQueryBuilder()
            .select('history.id', 'id')
            .addSelect('history.hasDeleted', 'hasDeleted')
            .addSelect('image.publicId', 'publicId')
            .from(ImageHistory, 'history')
            .addFrom(Image, 'image')
            .where('image.id=history.imageId')
            .andWhere('history.id=:id', { id })
            .orderBy('history.createdDate', 'DESC')
            .getRawOne();

        if (!result) {
            throw Errors.ImageHistoryNotFoundErrorBusiness(id);
        }

        return result;
    }

    //TODO: handle this
    async update(id: string) {
        const imageHistory = await this.findOneHasNotDeleted(id);

        if (!imageHistory) {
            throw Errors.ImageHistoryNotFoundErrorBusiness(id);
        }

        const publicIdExists: DeleteImageInput = {
            publicId: imageHistory.publicId,
        };

        const validatea = await validate(publicIdExists);

        // if(!validate)
        // imageHistory.hasDeleted = true;

        // await this.imageHistoryRepository.save(imageHistory);

        return `This action updates a #${id} imageHistory`;
    }

    async remove(id: string) {
        const imageExists = await this.findOneHasDeleted(id);

        const result = await this.imageHistoryRepository.remove(imageExists);

        return result;
    }
}
