import { MigrationInterface, QueryRunner } from "typeorm";

export class TblSingleQuestionValueAddColOrder1714963534097 implements MigrationInterface {
    name = 'TblSingleQuestionValueAddColOrder1714963534097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_value" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_value" DROP COLUMN "order"`);
    }

}
