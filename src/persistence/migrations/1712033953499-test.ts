import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1712033953499 implements MigrationInterface {
    name = 'Test1712033953499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_answer" DROP CONSTRAINT "FK_2fc03d7321aed1f83555663158f"`);
        await queryRunner.query(`ALTER TABLE "group_question_answer" ADD CONSTRAINT "FK_2fc03d7321aed1f83555663158f" FOREIGN KEY ("columnId") REFERENCES "group_question_column"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_answer" DROP CONSTRAINT "FK_2fc03d7321aed1f83555663158f"`);
        await queryRunner.query(`ALTER TABLE "group_question_answer" ADD CONSTRAINT "FK_2fc03d7321aed1f83555663158f" FOREIGN KEY ("columnId") REFERENCES "group_question_row"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
