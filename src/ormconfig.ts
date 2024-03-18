import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

// Load environment variables from .env file
dotenvExpand.expand(dotenv.config());
import { join } from 'path';
import { getTypeOrmConfig } from './cores/database/database.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: DataSourceOptions[] = [
    {
        ...getTypeOrmConfig(),
        migrations: [join(__dirname, 'persistence', 'migrations', '*.{js,ts}')],
    },
];
export default typeOrmConfig;
