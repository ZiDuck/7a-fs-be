import { MigrationInterface, QueryRunner } from "typeorm";

export class TblTemplateForm1712204570136 implements MigrationInterface {
    name = 'TblTemplateForm1712204570136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."form_template_category_enum" AS ENUM('PATIENT_CATEGORY', 'EMPLOYEE_CATEGORY')`);
        await queryRunner.query(`CREATE TABLE "form_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(1000) NOT NULL DEFAULT '', "category" "public"."form_template_category_enum" NOT NULL, "metadata" jsonb NOT NULL, CONSTRAINT "PK_656844082de48d37a2c8fb7cfdb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "form_template"`);
        await queryRunner.query(`DROP TYPE "public"."form_template_category_enum"`);
    }

}
