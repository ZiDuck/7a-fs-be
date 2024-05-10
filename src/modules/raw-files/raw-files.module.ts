import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RawFile } from './enitites/raw-file.entity';
import { RawFilesController } from './raw-files.controller';
import { RawFilesService } from './raw-files.service';

@Module({
    imports: [TypeOrmModule.forFeature([RawFile])],
    controllers: [RawFilesController],
    providers: [RawFilesService],
    exports: [RawFilesService],
})
export class RawFilesModule {}
