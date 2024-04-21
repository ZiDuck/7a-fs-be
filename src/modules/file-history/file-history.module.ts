import { Module } from '@nestjs/common';
import { FileHistoryService } from './file-history.service';
import { FileHistoryController } from './file-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileHistory } from './entites/file-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FileHistory])],
    controllers: [FileHistoryController],
    providers: [FileHistoryService],
})
export class FileHistoryModule {}
