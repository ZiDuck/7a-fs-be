import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

// Load environment variables from .env file
dotenvExpand.expand(dotenv.config());
import { join } from 'path';
import { getTypeOrmConfig } from './cores/database/database.module';
import { ConnectionOptions } from 'typeorm-seeding';

const typeOrmConfig: ConnectionOptions[] = [
    {
        ...getTypeOrmConfig(),
        migrations: [join(__dirname, 'persistence', 'migrations', '*.{js,ts}')],
        seeds: [join(__dirname, 'database-seeding', 'seeds', '*.{js,ts}')],
        factories: [join(__dirname, 'database-seeding', 'factories', '*.{js,ts}')],
        // factories: [`${__dirname}/database-seeding/factories/**/*{.ts,.js}`],
    },
];
export default typeOrmConfig;
