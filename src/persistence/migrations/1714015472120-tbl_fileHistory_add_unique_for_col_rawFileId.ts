import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFileHistoryAddUniqueForColRawFileId1714015472120 implements MigrationInterface {
    name = 'TblFileHistoryAddUniqueForColRawFileId1714015472120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_history" ADD CONSTRAINT "UQ_0d8923442f91e37366555b75492" UNIQUE ("rawFileId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_history" DROP CONSTRAINT "UQ_0d8923442f91e37366555b75492"`);
    }

}
