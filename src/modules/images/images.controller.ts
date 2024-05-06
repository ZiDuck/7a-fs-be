import { Controller, Get } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImageOutput } from './dto/image.output';

@Controller('images')
export class ImagesController {
    constructor(private readonly imageService: ImagesService) {}

    // @Get()
    // async getAllImages(): Promise<ImageOutput[]> {
    //     return await this.imageService.getAll();
    // }
}
