import { MigrationInterface, QueryRunner } from "typeorm";

export class TblSingleQuestionValueAddColIsOther1714021456416 implements MigrationInterface {
    name = 'TblSingleQuestionValueAddColIsOther1714021456416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_attribute" DROP COLUMN "isOther"`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ADD "isOther" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_value" DROP COLUMN "isOther"`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" ADD "isOther" boolean NOT NULL DEFAULT false`);
    }

}
