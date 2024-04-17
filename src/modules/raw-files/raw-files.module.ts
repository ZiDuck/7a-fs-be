import { Module } from '@nestjs/common';
import { RawFilesService } from './raw-files.service';
import { RawFilesController } from './raw-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawFile } from './enitites/raw-file.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RawFile])],
    controllers: [RawFilesController],
    providers: [RawFilesService],
    exports: [RawFilesService],
})
export class RawFilesModule {}
