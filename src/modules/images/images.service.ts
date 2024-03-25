import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadFileService } from '../upload-file/upload-file.service';
import { UpdateImageInput } from './dto/update-image.input';
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

    async create(data: CreateImageInput) {
        const result = this.imageRepository.create(data);

        await this.imageRepository.save(result);

        return result;
    }

    async deleteOneImage(condition: DeleteImageInput) {
        const image = await this.imageRepository.findOneBy({ publicId: condition.publicId });

        if (image) await this.imageRepository.remove(image);

        await this.deleteImageOnCloud([condition.publicId]);
    }

    // async deleteImages(condition: Prisma.ImageWhereInput) {
    //   const images: Image[] = await this.prisma.image.findMany({
    //     where: condition,
    //   });
    //   this.deleteImageOnCloud(images.map((image) => image.publicId));
    // }

    async delete(publicId: string) {
        const image = await this.imageRepository.findOneBy({ publicId });

        if (!image) {
            throw new BadRequestException('Image Not Found!');
        }

        await this.imageRepository.remove(image);
    }

    async deleteImageOnCloud(publicIds: string[]) {
        await this.cloudinaryService.deleteResources(publicIds, ResourceType.IMAGE);
    }

    // async deleteOneImageForGallery(condition: Prisma.ImageWhereUniqueInput) {
    //   const image = await this.prisma.image.findUnique({
    //     where: condition,
    //   });

    //   if (image) {
    //     await this.deleteImageOnCloud([image.publicId]);
    //     await this.prisma.image.delete({
    //       where: condition,
    //     });
    //   } else {
    //     throw new Exception('Image Not Exists!');
    //   }
    // }
}
