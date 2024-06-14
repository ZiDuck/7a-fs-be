import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../cores/database/database.module';
import { CloudinaryModule } from '../../modules/cloudinary/cloudinary.module';
import { FilePublicIdExistsConstraint } from './file.validator';
import { RSFilePublicIdExistsConstraint } from './resource-type-file.validator';
import { UuidExistsConstraint } from './uuid.validator';

@Module({
    imports: [DatabaseModule, CloudinaryModule],
    providers: [UuidExistsConstraint, FilePublicIdExistsConstraint, RSFilePublicIdExistsConstraint],
    exports: [UuidExistsConstraint, FilePublicIdExistsConstraint, RSFilePublicIdExistsConstraint],
})
export class ValidatorModule {}
