import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeImageIdVarcharIntoUuid1712897499482 implements MigrationInterface {
    name = 'ChangeImageIdVarcharIntoUuid1712897499482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_history" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "image_history" ADD "imageId" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_history" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "image_history" ADD "imageId" character varying(1000)`);
    }

}
