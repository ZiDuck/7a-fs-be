import { MigrationInterface, QueryRunner } from "typeorm";

export class TblNotificationUpdateNotificationType1715335299900 implements MigrationInterface {
    name = 'TblNotificationUpdateNotificationType1715335299900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('CREATE_USER', 'UPDATE_USER', 'DElETE_USER', 'RESTORE_USER', 'BACKUP_DATA', 'CREATE_FORM', 'CREATE_FORM_QUESTION', 'UPDATE_FORM', 'UPDATE_FORM_QUESTION', 'DELETE_FORM', 'ACCEPT_FORM', 'CANCEL_FORM', 'REJECT_FORM', 'CLOSE_FORM', 'RESTORE_FORM')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('CREATE_USER', 'UPDATE_USER', 'DElETE_USER', 'RESTORE_USER', 'BACKUP_DATA', 'CREATE_FORM', 'UPDATE_FORM', 'DELETE_FORM', 'ACCEPTED_FORM', 'CANCEL_FORM', 'REJECTED_FORM', 'RESTORE_FORM')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`);
    }

}
