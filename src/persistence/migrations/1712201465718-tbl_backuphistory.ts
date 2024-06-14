import { MigrationInterface, QueryRunner } from "typeorm";

export class TblBackuphistory1712201465718 implements MigrationInterface {
    name = 'TblBackuphistory1712201465718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "backup_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100), "path" character varying(100), "size" numeric, "lastMod" character varying(100), CONSTRAINT "PK_b9e34ae46652853f5e732e2154e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "backup_history"`);
    }

}
