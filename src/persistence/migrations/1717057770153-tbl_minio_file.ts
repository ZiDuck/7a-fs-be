import { MigrationInterface, QueryRunner } from "typeorm";

export class TblMinioFile1717057770153 implements MigrationInterface {
    name = 'TblMinioFile1717057770153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "minio_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "pathFile" character varying(1000), "mimetype" character varying(1000), "bytes" numeric, "lastMod" character varying(100), CONSTRAINT "PK_449b5424f1534c8b50b9aed6862" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "minio_file"`);
    }

}
