import { MigrationInterface, QueryRunner } from "typeorm";

export class TblImageHistory1712890886828 implements MigrationInterface {
    name = 'TblImageHistory1712890886828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "imageId" character varying(1000), "hasDeleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_869a8d158f89a0d7d29d52b2dcc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "image_history"`);
    }

}
