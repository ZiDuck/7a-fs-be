import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { env } from '../utils/env.util';
import entities from './entities';

export function getTypeOrmConfig(): DataSourceOptions {
    return {
        type: 'postgres',
        host: env.String('POSTGRES_HOST'),
        port: env.Int('POSTGRES_PORT', 5432),
        username: env.String('POSTGRES_USER'),
        database: env.String('POSTGRES_DATABASE'),
        password: env.String('POSTGRES_PASSWORD'),
        migrationsTableName: 'migrations',
        entities: entities,
        synchronize: false,
        logging: true,
    };
}

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: getTypeOrmConfig,
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('Invalid options passed');
                }
                return addTransactionalDataSource(new DataSource(options));
            },
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
