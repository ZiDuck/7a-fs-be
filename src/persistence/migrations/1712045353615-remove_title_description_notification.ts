import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTitleDescriptionNotification1712045353615 implements MigrationInterface {
    name = 'RemoveTitleDescriptionNotification1712045353615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "description" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "title" character varying(100)`);
    }

}
