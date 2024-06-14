import { MigrationInterface, QueryRunner } from "typeorm";

export class TblImageAddSomeInfoFromCloudinary1713587207616 implements MigrationInterface {
    name = 'TblImageAddSomeInfoFromCloudinary1713587207616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "filename" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "image" ADD "secureUrl" text`);
        await queryRunner.query(`ALTER TABLE "image" ADD "bytes" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "bytes"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "secureUrl"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "filename"`);
    }

}
