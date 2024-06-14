import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOndeleteCascade1712805863189 implements MigrationInterface {
    name = 'UpdateOndeleteCascade1712805863189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_ec2a43c6b6b1b81c7714425a63a"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_daf92d80718eddcfef25bf1ccb2"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_ec2a43c6b6b1b81c7714425a63a" FOREIGN KEY ("sentByUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_daf92d80718eddcfef25bf1ccb2" FOREIGN KEY ("receivedByUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_daf92d80718eddcfef25bf1ccb2"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_ec2a43c6b6b1b81c7714425a63a"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_daf92d80718eddcfef25bf1ccb2" FOREIGN KEY ("receivedByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_ec2a43c6b6b1b81c7714425a63a" FOREIGN KEY ("sentByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
