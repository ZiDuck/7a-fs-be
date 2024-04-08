import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldsInBackuphistory1712293220921 implements MigrationInterface {
    name = 'ChangeFieldsInBackuphistory1712293220921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "filename" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "publicId" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "secureUrl" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "resourceType" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "bytes" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "bytes"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "resourceType"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "secureUrl"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "filename"`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "path" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "size" numeric`);
    }

}
