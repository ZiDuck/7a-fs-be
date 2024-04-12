import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateImageInput } from './dto/create-image.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entites/image.entity';
import { ResourceType } from '../../cores/enums/resource-type.enum';
import { DeleteImageInput } from './dto/delete-image.input';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image) private imageRepository: Repository<Image>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async getAll() {
        return await this.imageRepository.find();
    }

    async findOne(id: string) {
        const result = await this.imageRepository.findOneBy({ id });

        if (!result) {
            throw new BadRequestException('Image Not Found!');
        }

        return result;
    }

    async checkImageHook(id: string) {
        const image = await this.imageRepository.findOneBy({ id });

        if (!image) return null;

        return {
            id: image.id,
            publicId: image.publicId,
            url: image.url,
        };
    }

    async create(data: CreateImageInput) {
        const result = this.imageRepository.create(data);

        await this.imageRepository.save(result);

        return result;
    }

    async deleteOne(condition: DeleteImageInput) {
        const image = await this.imageRepository.findOneBy({ publicId: condition.publicId });

        if (image) await this.imageRepository.remove(image);

        const result = await this.deleteImageOnCloud([condition.publicId]);

        return result ? true : false;
    }

    // async deleteImages(condition: DeleteImagesInput) {
    //     const images: Image[] = await this.prisma.image.findMany({
    //         where: condition,
    //     });
    //     this.deleteImageOnCloud(images.map((image) => image.publicId));
    // }

    async delete(publicId: string) {
        const image = await this.imageRepository.findOneBy({ publicId });

        if (!image) {
            throw new BadRequestException('Image Not Found!');
        }

        await this.imageRepository.remove(image);
    }

    async deleteImageOnCloud(publicIds: string[]) {
        const result = await this.cloudinaryService.deleteResources(publicIds, ResourceType.IMAGE);

        return result ? true : false;
    }
}
