import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesForForms1711525466284 implements MigrationInterface {
    name = 'AddTablesForForms1711525466284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."form_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."form_category_enum" AS ENUM('PATIENT_CATEGORY', 'EMPLOYEE_CATEGORY')`);
        await queryRunner.query(`CREATE TABLE "form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(1000) NOT NULL DEFAULT '', "description" character varying(2000), "startSurvey" TIMESTAMP NOT NULL, "status" "public"."form_status_enum" NOT NULL, "hasAnswer" boolean NOT NULL DEFAULT false, "category" "public"."form_category_enum" NOT NULL, "imageId" uuid, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "single_question_value" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying, "imageId" uuid, "attributeId" uuid NOT NULL, CONSTRAINT "PK_6cf1b1290344a5b57fe01e182c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "single_question_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "score" double precision, "isOther" boolean NOT NULL DEFAULT false, "questionId" uuid NOT NULL, CONSTRAINT "REL_b2750c5fe63be39830b063e7cb" UNIQUE ("questionId"), CONSTRAINT "PK_7929026d3550378218083815fff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."form_question_attributetype_enum" AS ENUM('TEXT_BOX', 'PARAGRAPH', 'CHECKBOX_BUTTON', 'RADIO_BUTTON', 'DROPDOWN', 'FILE_UPLOAD', 'STAR', 'CHECKBOX_GRID', 'RADIO_GRID')`);
        await queryRunner.query(`CREATE TABLE "form_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "label" character varying(1000) NOT NULL, "description" character varying(2000), "require" boolean NOT NULL DEFAULT false, "order" integer NOT NULL, "imageId" uuid, "attributeType" "public"."form_question_attributetype_enum" NOT NULL, "formId" uuid NOT NULL, CONSTRAINT "PK_5bc5aa86b9da4b82b41726d8126" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "single_question_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "attributeId" uuid NOT NULL, CONSTRAINT "PK_4c731a9cc8f28bddbad32d3d8f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "single_question_value" ADD CONSTRAINT "FK_897355b7b32bed04c20c1eb7cee" FOREIGN KEY ("attributeId") REFERENCES "single_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" ADD CONSTRAINT "FK_b2750c5fe63be39830b063e7cb5" FOREIGN KEY ("questionId") REFERENCES "form_question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_question" ADD CONSTRAINT "FK_2072351f9e24ad25ffa22bc93bf" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "single_question_answer" ADD CONSTRAINT "FK_c26a433c8c84c5e78e639cf8cf8" FOREIGN KEY ("attributeId") REFERENCES "single_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_answer" DROP CONSTRAINT "FK_c26a433c8c84c5e78e639cf8cf8"`);
        await queryRunner.query(`ALTER TABLE "form_question" DROP CONSTRAINT "FK_2072351f9e24ad25ffa22bc93bf"`);
        await queryRunner.query(`ALTER TABLE "single_question_attribute" DROP CONSTRAINT "FK_b2750c5fe63be39830b063e7cb5"`);
        await queryRunner.query(`ALTER TABLE "single_question_value" DROP CONSTRAINT "FK_897355b7b32bed04c20c1eb7cee"`);
        await queryRunner.query(`DROP TABLE "single_question_answer"`);
        await queryRunner.query(`DROP TABLE "form_question"`);
        await queryRunner.query(`DROP TYPE "public"."form_question_attributetype_enum"`);
        await queryRunner.query(`DROP TABLE "single_question_attribute"`);
        await queryRunner.query(`DROP TABLE "single_question_value"`);
        await queryRunner.query(`DROP TABLE "form"`);
        await queryRunner.query(`DROP TYPE "public"."form_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."form_status_enum"`);
    }

}
