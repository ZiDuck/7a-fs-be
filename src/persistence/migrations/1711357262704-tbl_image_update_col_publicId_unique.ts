import { MigrationInterface, QueryRunner } from "typeorm";

export class TblImageUpdateColPublicIdUnique1711357262704 implements MigrationInterface {
    name = 'TblImageUpdateColPublicIdUnique1711357262704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "UQ_817cd9e79b1d80067ecc46f7e0a" UNIQUE ("publicId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "UQ_817cd9e79b1d80067ecc46f7e0a"`);
    }

}
