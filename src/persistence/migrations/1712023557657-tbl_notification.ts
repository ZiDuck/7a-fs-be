import { MigrationInterface, QueryRunner } from "typeorm";

export class TblNotification1712023557657 implements MigrationInterface {
    name = 'TblNotification1712023557657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum" AS ENUM('SUCCESS', 'FAILED', 'WARNING')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('CREATE_USER', 'UPDATE_USER', 'DElETE_USER', 'RESTORE_USER', 'BACKUP_DATA', 'CREATE_FORM', 'UPDATE_FORM', 'DELETE_FORM', 'ACCEPTED_FORM', 'CANCEL_FORM', 'REJECTED_FORM', 'RESTORE_FORM')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(100), "description" character varying(100), "status" "public"."notification_status_enum", "type" "public"."notification_type_enum" NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "sentByUserId" uuid, "receivedByUserId" uuid NOT NULL, "userId" uuid, "formId" uuid NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_33f33cc8ef29d805a97ff4628b" ON "notification" ("type") `);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_ec2a43c6b6b1b81c7714425a63a" FOREIGN KEY ("sentByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_daf92d80718eddcfef25bf1ccb2" FOREIGN KEY ("receivedByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_daf92d80718eddcfef25bf1ccb2"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_ec2a43c6b6b1b81c7714425a63a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33f33cc8ef29d805a97ff4628b"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
    }

}
