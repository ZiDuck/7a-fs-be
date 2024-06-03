import { MigrationInterface, QueryRunner } from "typeorm";

export class TblBackupHistoryUpdateSomeFields1717385548762 implements MigrationInterface {
    name = 'TblBackupHistoryUpdateSomeFields1717385548762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "publicId"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "secureUrl"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "resourceType"`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "pathFile" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "mimetype" character varying(1000)`);
        await queryRunner.query(`ALTER TABLE "minio_file" ADD "filename" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "minio_file" DROP COLUMN "filename"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "mimetype"`);
        await queryRunner.query(`ALTER TABLE "backup_history" DROP COLUMN "pathFile"`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "resourceType" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "secureUrl" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "backup_history" ADD "publicId" character varying(1000)`);
    }

}
