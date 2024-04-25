import { Module } from '@nestjs/common';
import { ImageHistoryService } from './image-history.service';
import { ImageHistoryController } from './image-history.controller';
import { ImageHistory } from './entities/image-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [ImageHistoryController],
    providers: [ImageHistoryService],
    imports: [TypeOrmModule.forFeature([ImageHistory])],
    exports: [ImageHistoryService],
})
export class ImageHistoryModule {}
