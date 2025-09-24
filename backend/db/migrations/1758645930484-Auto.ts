import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1758645930484 implements MigrationInterface {
    name = 'Auto1758645930484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "navigation" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "navigation" ADD "title" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "navigation" DROP CONSTRAINT "UQ_e246b92bbafa3474080efb529e1"`);
        await queryRunner.query(`ALTER TABLE "navigation" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "navigation" ADD "slug" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "navigation" ADD CONSTRAINT "UQ_e246b92bbafa3474080efb529e1" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "title" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "slug" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "navigation" DROP CONSTRAINT "UQ_e246b92bbafa3474080efb529e1"`);
        await queryRunner.query(`ALTER TABLE "navigation" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "navigation" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "navigation" ADD CONSTRAINT "UQ_e246b92bbafa3474080efb529e1" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "navigation" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "navigation" ADD "title" character varying NOT NULL`);
    }

}
