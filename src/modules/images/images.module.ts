import { Module } from '@nestjs/common';
import { Image } from './entites/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImagesService } from './images.service';
import { ValidatorModule } from '../../common/validator/validator.module';

@Module({
    imports: [TypeOrmModule.forFeature([Image]), CloudinaryModule, ValidatorModule],
    providers: [ImagesService],
    exports: [ImagesService],
    controllers: [ImagesController],
})
export class ImagesModule {}
