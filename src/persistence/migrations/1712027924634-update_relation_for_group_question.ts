import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationForGroupQuestion1712027924634 implements MigrationInterface {
    name = 'UpdateRelationForGroupQuestion1712027924634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_row" DROP CONSTRAINT "FK_362788a396f325741e51e9e29ce"`);
        await queryRunner.query(`ALTER TABLE "group_question_row" DROP CONSTRAINT "REL_362788a396f325741e51e9e29c"`);
        await queryRunner.query(`ALTER TABLE "group_question_column" DROP CONSTRAINT "FK_227febdb0e880a1e2995770d984"`);
        await queryRunner.query(`ALTER TABLE "group_question_column" DROP CONSTRAINT "REL_227febdb0e880a1e2995770d98"`);
        await queryRunner.query(`ALTER TABLE "group_question_row" ADD CONSTRAINT "FK_362788a396f325741e51e9e29ce" FOREIGN KEY ("groupId") REFERENCES "group_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_question_column" ADD CONSTRAINT "FK_227febdb0e880a1e2995770d984" FOREIGN KEY ("groupId") REFERENCES "group_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_question_column" DROP CONSTRAINT "FK_227febdb0e880a1e2995770d984"`);
        await queryRunner.query(`ALTER TABLE "group_question_row" DROP CONSTRAINT "FK_362788a396f325741e51e9e29ce"`);
        await queryRunner.query(`ALTER TABLE "group_question_column" ADD CONSTRAINT "REL_227febdb0e880a1e2995770d98" UNIQUE ("groupId")`);
        await queryRunner.query(`ALTER TABLE "group_question_column" ADD CONSTRAINT "FK_227febdb0e880a1e2995770d984" FOREIGN KEY ("groupId") REFERENCES "group_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_question_row" ADD CONSTRAINT "REL_362788a396f325741e51e9e29c" UNIQUE ("groupId")`);
        await queryRunner.query(`ALTER TABLE "group_question_row" ADD CONSTRAINT "FK_362788a396f325741e51e9e29ce" FOREIGN KEY ("groupId") REFERENCES "group_question_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
