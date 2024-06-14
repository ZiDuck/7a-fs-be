import { MigrationInterface, QueryRunner } from "typeorm";

export class TblGroupQuestionAnswerAddColIsCorrect1712028945360 implements MigrationInterface {
    name = 'TblGroupQuestionAnswerAddColIsCorrect1712028945360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_answer" ADD "isCorrect" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_answer" DROP COLUMN "isCorrect"`);
    }

}
