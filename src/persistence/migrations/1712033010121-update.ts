import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1712033010121 implements MigrationInterface {
    name = 'Update1712033010121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_row" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group_question_column" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_column" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "group_question_row" DROP COLUMN "order"`);
    }

}
