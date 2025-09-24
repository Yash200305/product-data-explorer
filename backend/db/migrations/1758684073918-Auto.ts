import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1758684073918 implements MigrationInterface {
    name = 'Auto1758684073918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "navigation" ADD "last_scraped_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "category" ADD "last_scraped_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "review" ADD "comment" text NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "author" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "rating" SET DEFAULT '0'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cb73208f151aa71cdd78f662d7" ON "category" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_4bfb1435eb59fbeeff9f74d50a" ON "category" ("last_scraped_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4bfb1435eb59fbeeff9f74d50a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb73208f151aa71cdd78f662d7"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "rating" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "author" character varying NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "last_scraped_at"`);
        await queryRunner.query(`ALTER TABLE "navigation" DROP COLUMN "last_scraped_at"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "text" text NOT NULL`);
    }

}
