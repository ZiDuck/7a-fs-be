export interface IDatabaseConfigAttributes {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number | string;
    type?: string;
    urlDatabase?: string;
    entities?: [string];
    migrations?: [string];
    migrationsTableName?: string;
    extra?: object;
    synchronize?: boolean;
    logging?: boolean;
}

export interface IDatabaseConfig {
    development: IDatabaseConfigAttributes;
    test: IDatabaseConfigAttributes;
    production: IDatabaseConfigAttributes;
}
