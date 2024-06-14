import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageHistory } from './entities/image-history.entity';
import { ImageHistoryController } from './image-history.controller';
import { ImageHistoryService } from './image-history.service';

@Module({
    controllers: [ImageHistoryController],
    providers: [ImageHistoryService],
    imports: [TypeOrmModule.forFeature([ImageHistory])],
    exports: [ImageHistoryService],
})
export class ImageHistoryModule {}
