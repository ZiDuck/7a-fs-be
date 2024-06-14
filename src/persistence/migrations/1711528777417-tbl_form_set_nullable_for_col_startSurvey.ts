import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFormSetNullableForColStartSurvey1711528777417 implements MigrationInterface {
    name = 'TblFormSetNullableForColStartSurvey1711528777417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "startSurvey" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ALTER COLUMN "startSurvey" SET NOT NULL`);
    }

}
