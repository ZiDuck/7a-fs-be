import { MigrationInterface, QueryRunner } from "typeorm";

export class TblFileHistoryAddResourceType1713845767543 implements MigrationInterface {
    name = 'TblFileHistoryAddResourceType1713845767543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."file_history_resourcetype_enum" AS ENUM('image', 'video', 'raw')`);
        await queryRunner.query(`ALTER TABLE "file_history" ADD "resourceType" "public"."file_history_resourcetype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "raw_file" DROP COLUMN "resourceType"`);
        await queryRunner.query(`CREATE TYPE "public"."raw_file_resourcetype_enum" AS ENUM('image', 'video', 'raw')`);
        await queryRunner.query(`ALTER TABLE "raw_file" ADD "resourceType" "public"."raw_file_resourcetype_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raw_file" DROP COLUMN "resourceType"`);
        await queryRunner.query(`DROP TYPE "public"."raw_file_resourcetype_enum"`);
        await queryRunner.query(`ALTER TABLE "raw_file" ADD "resourceType" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "file_history" DROP COLUMN "resourceType"`);
        await queryRunner.query(`DROP TYPE "public"."file_history_resourcetype_enum"`);
    }

}
