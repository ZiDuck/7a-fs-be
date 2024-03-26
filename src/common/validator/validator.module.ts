import { Module } from '@nestjs/common';
import { UuidExistsConstraint } from './uuid.validator';
import { DatabaseModule } from '../../cores/database/database.module';
import { FilePublicIdExistsConstraint } from './file.validator';
import { CloudinaryModule } from '../../modules/cloudinary/cloudinary.module';

@Module({
    imports: [DatabaseModule, CloudinaryModule],
    providers: [UuidExistsConstraint, FilePublicIdExistsConstraint],
    exports: [UuidExistsConstraint, FilePublicIdExistsConstraint],
})
export class ValidatorModule {}
