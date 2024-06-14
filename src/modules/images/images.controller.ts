import { Controller } from '@nestjs/common';

import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
    constructor(private readonly imageService: ImagesService) {}

    // @Get()
    // async getAllImages(): Promise<ImageOutput[]> {
    //     return await this.imageService.getAll();
    // }
}
