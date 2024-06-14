import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTblFormAudit1712848832683 implements MigrationInterface {
    name = 'AddTblFormAudit1712848832683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "form_audit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "form" jsonb NOT NULL, "isMaster" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a855f70186b29d370c1114100ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "form" ADD "version" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "version"`);
        await queryRunner.query(`DROP TABLE "form_audit"`);
    }

}
