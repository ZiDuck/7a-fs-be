import { MigrationInterface, QueryRunner } from 'typeorm';

export class RmTblSingleQuestionAnswer1711617258778 implements MigrationInterface {
    name = 'RmTblSingleQuestionAnswer1711617258778';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_value" ADD "isCorrect" boolean`);
        await queryRunner.query(`ALTER TABLE "single_question_answer" DROP CONSTRAINT "FK_c26a433c8c84c5e78e639cf8cf8"`);
        await queryRunner.query(`DROP TABLE "single_question_answer"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_value" DROP COLUMN "isCorrect"`);
        await queryRunner.query(
            `CREATE TABLE "single_question_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "attributeId" uuid NOT NULL, CONSTRAINT "PK_4c731a9cc8f28bddbad32d3d8f3" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "single_question_answer" ADD CONSTRAINT "FK_c26a433c8c84c5e78e639cf8cf8" FOREIGN KEY ("attributeId") REFERENCES "single_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }
}
