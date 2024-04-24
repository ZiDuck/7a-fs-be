import { Module } from '@nestjs/common';
import { UuidExistsConstraint } from './uuid.validator';
import { DatabaseModule } from '../../cores/database/database.module';
import { FilePublicIdExistsConstraint } from './file.validator';
import { CloudinaryModule } from '../../modules/cloudinary/cloudinary.module';
import { RSFilePublicIdExistsConstraint } from './resource-type-file.validator';

@Module({
    imports: [DatabaseModule, CloudinaryModule],
    providers: [UuidExistsConstraint, FilePublicIdExistsConstraint, RSFilePublicIdExistsConstraint],
    exports: [UuidExistsConstraint, FilePublicIdExistsConstraint, RSFilePublicIdExistsConstraint],
})
export class ValidatorModule {}
