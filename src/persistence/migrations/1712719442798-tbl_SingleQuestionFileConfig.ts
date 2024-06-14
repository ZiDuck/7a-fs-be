import { MigrationInterface, QueryRunner } from "typeorm";

export class TblSingleQuestionFileConfig1712719442798 implements MigrationInterface {
    name = 'TblSingleQuestionFileConfig1712719442798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "single_question_file_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "maxNumOfFiles" double precision NOT NULL DEFAULT '1', "maxFileSize" double precision NOT NULL DEFAULT '10', "attributeId" uuid NOT NULL, CONSTRAINT "REL_916a20e54ec2065fe2cddc067a" UNIQUE ("attributeId"), CONSTRAINT "PK_20d10ee6d43b786742fc3b44364" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "single_question_file_config" ADD CONSTRAINT "FK_916a20e54ec2065fe2cddc067a0" FOREIGN KEY ("attributeId") REFERENCES "single_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_question_file_config" DROP CONSTRAINT "FK_916a20e54ec2065fe2cddc067a0"`);
        await queryRunner.query(`DROP TABLE "single_question_file_config"`);
    }

}
