import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFormSetDefaultForColStatus1711527566937 implements MigrationInterface {
    name = 'TblFormSetDefaultForColStatus1711527566937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
