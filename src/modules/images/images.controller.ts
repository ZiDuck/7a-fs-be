import { Body, Controller, Delete, Get, HttpException, InternalServerErrorException } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImageOutput } from './dto/image.output';
import { DeleteImageInput } from './dto/delete-image.input';
import { Transactional } from 'typeorm-transactional';

@Controller('images')
export class ImagesController {
    constructor(private readonly imageService: ImagesService) {}

    @Get()
    async getAllImages(): Promise<ImageOutput[]> {
        return await this.imageService.getAll();
    }

    @Delete()
    @Transactional()
    async deleteImage(@Body() data: DeleteImageInput): Promise<void> {
        try {
            await this.imageService.deleteOneImage(data);
        } catch (error) {
            if (error instanceof HttpException) throw error;

            throw new InternalServerErrorException(error.message);
        }
    }
}
