import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFormAddColCanSeeCorrectAnswer1714233527495 implements MigrationInterface {
    name = 'TblFormAddColCanSeeCorrectAnswer1714233527495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ADD "canSeeCorrectAnswer" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "canSeeCorrectAnswer"`);
    }

}
