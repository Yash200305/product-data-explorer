import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1758644670691 implements MigrationInterface {
    name = 'Auto1758644670691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "navigation" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "UQ_e246b92bbafa3474080efb529e1" UNIQUE ("slug"), CONSTRAINT "PK_a7c90881db5205ad8d6b86ffef7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "navigation_id" integer, "title" character varying NOT NULL, "slug" character varying NOT NULL, "navigationId" integer, "parentId" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_detail" ("id" SERIAL NOT NULL, "description" text, "specs" jsonb, "ratings_avg" numeric(3,2), "reviews_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_12ea67a439667df5593ff68fc33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "source_id" text NOT NULL, "title" text NOT NULL, "price" numeric(10,2) NOT NULL, "currency" text NOT NULL DEFAULT 'GBP', "image_url" text, "source_url" text NOT NULL, "last_scraped_at" TIMESTAMP WITH TIME ZONE, "categoryId" integer, "detail_id" integer, CONSTRAINT "UQ_c210304b89037da478d036e047e" UNIQUE ("source_id"), CONSTRAINT "REL_12ea67a439667df5593ff68fc3" UNIQUE ("detail_id"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_70852190049b6b3403d4b27c4b" ON "product" ("last_scraped_at") `);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "author" character varying NOT NULL, "rating" integer NOT NULL, "text" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scrape_job" ("id" SERIAL NOT NULL, "target_url" character varying NOT NULL, "target_type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'queued', "started_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "finished_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "error_log" text, CONSTRAINT "PK_a1ad8d7b3bd3aeb0a4921021ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a4316ecd1a8e69e9e78a4fad3b" ON "scrape_job" ("status", "target_type") `);
        await queryRunner.query(`CREATE TABLE "view_history" ("id" SERIAL NOT NULL, "user_id" uuid, "session_id" text NOT NULL, "path_json" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_673e9aed816c5a0cf7f42886255" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_6e1cd16674951677469c3b1c53c" FOREIGN KEY ("navigationId") REFERENCES "navigation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_12ea67a439667df5593ff68fc33" FOREIGN KEY ("detail_id") REFERENCES "product_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_12ea67a439667df5593ff68fc33"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_6e1cd16674951677469c3b1c53c"`);
        await queryRunner.query(`DROP TABLE "view_history"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4316ecd1a8e69e9e78a4fad3b"`);
        await queryRunner.query(`DROP TABLE "scrape_job"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70852190049b6b3403d4b27c4b"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product_detail"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "navigation"`);
    }

}
