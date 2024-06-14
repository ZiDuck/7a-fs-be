import { MigrationInterface, QueryRunner } from 'typeorm';

export class TblGroupQuestion1711960374841 implements MigrationInterface {
    name = 'TblGroupQuestion1711960374841';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "group_question_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "rowId" uuid NOT NULL, "columnId" uuid NOT NULL, CONSTRAINT "PK_5ca7a96c3248cb26ca12c1996f0" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "group_question_row" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "score" double precision, "value" character varying NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "REL_362788a396f325741e51e9e29c" UNIQUE ("groupId"), CONSTRAINT "PK_64c93ffcd0eecbcfdbbd644570b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "group_question_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "questionId" uuid NOT NULL, CONSTRAINT "REL_50c152a6d38d755722a8382289" UNIQUE ("questionId"), CONSTRAINT "PK_852a99904b88748b0c831dbaf96" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "group_question_column" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "REL_227febdb0e880a1e2995770d98" UNIQUE ("groupId"), CONSTRAINT "PK_95c653871d0590407f826a76c67" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_question_answer" ADD CONSTRAINT "FK_206773b294af7547829a813a5e5" FOREIGN KEY ("rowId") REFERENCES "group_question_row"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_question_answer" ADD CONSTRAINT "FK_2fc03d7321aed1f83555663158f" FOREIGN KEY ("columnId") REFERENCES "group_question_row"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_question_row" ADD CONSTRAINT "FK_362788a396f325741e51e9e29ce" FOREIGN KEY ("groupId") REFERENCES "group_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_question_attribute" ADD CONSTRAINT "FK_50c152a6d38d755722a83822891" FOREIGN KEY ("questionId") REFERENCES "form_question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "group_question_column" ADD CONSTRAINT "FK_227febdb0e880a1e2995770d984" FOREIGN KEY ("groupId") REFERENCES "group_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_column" DROP CONSTRAINT "FK_227febdb0e880a1e2995770d984"`);
        await queryRunner.query(`ALTER TABLE "group_question_attribute" DROP CONSTRAINT "FK_50c152a6d38d755722a83822891"`);
        await queryRunner.query(`ALTER TABLE "group_question_row" DROP CONSTRAINT "FK_362788a396f325741e51e9e29ce"`);
        await queryRunner.query(`ALTER TABLE "group_question_answer" DROP CONSTRAINT "FK_2fc03d7321aed1f83555663158f"`);
        await queryRunner.query(`ALTER TABLE "group_question_answer" DROP CONSTRAINT "FK_206773b294af7547829a813a5e5"`);
        await queryRunner.query(`DROP TABLE "group_question_column"`);
        await queryRunner.query(`DROP TABLE "group_question_attribute"`);
        await queryRunner.query(`DROP TABLE "group_question_row"`);
        await queryRunner.query(`DROP TABLE "group_question_answer"`);
    }
}
