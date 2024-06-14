import { DataSource } from 'typeorm';

import typeOrmConfig from './ormconfig';
export = typeOrmConfig.map((option) => new DataSource(option));
