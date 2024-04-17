import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFormSubmit1713251573148 implements MigrationInterface {
    name = 'TblFormSubmit1713251573148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "form_submit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "metadata" jsonb NOT NULL, CONSTRAINT "PK_8b3688d6dab983996ed12e66716" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "form_submit"`);
    }

}
