import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNullableForScoreCol1712117028312 implements MigrationInterface {
    name = 'RemoveNullableForScoreCol1712117028312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_value" ALTER COLUMN "value" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ALTER COLUMN "isCorrect" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ALTER COLUMN "isCorrect" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" ALTER COLUMN "score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" ALTER COLUMN "score" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "group_question_row" ALTER COLUMN "score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group_question_row" ALTER COLUMN "score" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_row" ALTER COLUMN "score" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "group_question_row" ALTER COLUMN "score" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" ALTER COLUMN "score" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" ALTER COLUMN "score" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ALTER COLUMN "isCorrect" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ALTER COLUMN "isCorrect" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ALTER COLUMN "value" DROP NOT NULL`);
    }

}
