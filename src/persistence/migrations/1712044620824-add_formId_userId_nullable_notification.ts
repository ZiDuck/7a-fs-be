import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFormIdUserIdNullableNotification1712044620824 implements MigrationInterface {
    name = 'AddFormIdUserIdNullableNotification1712044620824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "formId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "formId" SET NOT NULL`);
    }

}
