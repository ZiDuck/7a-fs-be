import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1710816368045 implements MigrationInterface {
    name = 'InitialMigration1710816368045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_be9db163cb8d1b9cd6fcdff6100" PRIMARY KEY ("id", "refreshToken", "userId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(320) NOT NULL, "hashedPassword" character varying(4096) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "phone" character varying(15) NOT NULL, "address" character varying(2000) NOT NULL, "deletedDate" TIMESTAMP, "roleId" uuid NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying(100) NOT NULL, "description" character varying(1000) NOT NULL, CONSTRAINT "UQ_98082dbb08817c9801e32dd0155" UNIQUE ("value"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "forgotten_password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(320) NOT NULL, "newPasswordToken" character varying(50) NOT NULL, "expiredDate" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "UQ_c412a8dca38870e5ed68373781f" UNIQUE ("email"), CONSTRAINT "REL_8d1597ee5e6d7ba41ef13a80ec" UNIQUE ("userId"), CONSTRAINT "PK_9402cb7151088cd86e4748f0edd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "FK_b5eb7aa08382591e7c2d1244fe5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forgotten_password" ADD CONSTRAINT "FK_8d1597ee5e6d7ba41ef13a80ecb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgotten_password" DROP CONSTRAINT "FK_8d1597ee5e6d7ba41ef13a80ecb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "FK_b5eb7aa08382591e7c2d1244fe5"`);
        await queryRunner.query(`DROP TABLE "forgotten_password"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_session"`);
    }

}
