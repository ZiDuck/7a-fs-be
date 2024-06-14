import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFormQuestionUpdateTableInheritance1713325612167 implements MigrationInterface {
    name = 'TblFormQuestionUpdateTableInheritance1713325612167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_bea2dbb4c28de64db196862fe5" ON "form_question" ("attributeType") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bea2dbb4c28de64db196862fe5"`);
    }

}
