import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Image } from './entites/image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
    imports: [TypeOrmModule.forFeature([Image]), CloudinaryModule],
    providers: [ImagesService],
    exports: [ImagesService],
    controllers: [ImagesController],
})
export class ImagesModule {}
