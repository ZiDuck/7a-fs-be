import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftdeleteFieldsForTblForm1712807716900 implements MigrationInterface {
    name = 'AddSoftdeleteFieldsForTblForm1712807716900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_question" DROP CONSTRAINT "FK_2072351f9e24ad25ffa22bc93bf"`);
        await queryRunner.query(`ALTER TABLE "form" ADD "createdBy" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" ADD "updatedBy" character varying`);
        await queryRunner.query(`ALTER TABLE "form" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "single_question_file_config" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "group_question_column" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "group_question_answer" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "group_question_row" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "group_question_attribute" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "form_question" ADD "deletedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "form_question" ADD CONSTRAINT "FK_2072351f9e24ad25ffa22bc93bf" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_question" DROP CONSTRAINT "FK_2072351f9e24ad25ffa22bc93bf"`);
        await queryRunner.query(`ALTER TABLE "form_question" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "group_question_attribute" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "group_question_row" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "group_question_answer" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "group_question_column" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "single_question_file_config" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "single_question_value" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "form_question" ADD CONSTRAINT "FK_2072351f9e24ad25ffa22bc93bf" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
