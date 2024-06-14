import { MigrationInterface, QueryRunner } from "typeorm";

export class TblRawFile1713502642933 implements MigrationInterface {
    name = 'TblRawFile1713502642933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bea2dbb4c28de64db196862fe5"`);
        await queryRunner.query(`CREATE TABLE "raw_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "filename" character varying(1000), "publicId" character varying(320) NOT NULL, "url" character varying(1000) NOT NULL, "secureUrl" text NOT NULL, "resourceType" character varying(100), "bytes" numeric, CONSTRAINT "UQ_56823f299f4819c02e707b08049" UNIQUE ("publicId"), CONSTRAINT "PK_801aeb14e70462cbde854a21ed3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "raw_file"`);
        await queryRunner.query(`CREATE INDEX "IDX_bea2dbb4c28de64db196862fe5" ON "form_question" ("attributeType") `);
    }

}
