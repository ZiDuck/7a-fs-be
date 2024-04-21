import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFileHistory1713669648212 implements MigrationInterface {
    name = 'TblFileHistory1713669648212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "rawFileId" uuid NOT NULL, "hasDeleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0deb31e450cde5a323d8af4aa3a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "file_history"`);
    }

}
