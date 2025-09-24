import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoSafe1758697045282 implements MigrationInterface {
  name = 'AutoSafe1758697045282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Navigation: add last_scraped_at if missing
    await queryRunner.query(
      `ALTER TABLE "navigation" ADD COLUMN IF NOT EXISTS "last_scraped_at" TIMESTAMPTZ`
    );

    // Review: handle text -> comment rename safely
    await queryRunner.query(
      `ALTER TABLE "review" DROP COLUMN IF EXISTS "text"`
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD COLUMN IF NOT EXISTS "comment" text NOT NULL`
    );

    // Navigation/Category: ensure text type for title/slug (no-op if already text)
    await queryRunner.query(`ALTER TABLE "navigation" ALTER COLUMN "title" TYPE text`);
    await queryRunner.query(`ALTER TABLE "navigation" ALTER COLUMN "slug" TYPE text`);
    await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "title" TYPE text`);
    await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "slug" TYPE text`);

    // Navigation: reapply unique constraint with guard
    await queryRunner.query(
      `ALTER TABLE "navigation" DROP CONSTRAINT IF EXISTS "UQ_e246b92bbafa3474080efb529e1"`
    );
    await queryRunner.query(
      `ALTER TABLE "navigation" ADD CONSTRAINT "UQ_e246b92bbafa3474080efb529e1" UNIQUE ("slug")`
    );

    // Category: indexes with IF NOT EXISTS
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cb73208f151aa71cdd78f662d7" ON "category" ("slug")`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_4bfb1435eb59fbeeff9f74d50a" ON "category" ("last_scraped_at")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_4bfb1435eb59fbeeff9f74d50a"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cb73208f151aa71cdd78f662d7"`);
    await queryRunner.query(`ALTER TABLE "navigation" DROP CONSTRAINT IF EXISTS "UQ_e246b92bbafa3474080efb529e1"`);
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN IF EXISTS "comment"`);
    await queryRunner.query(`ALTER TABLE "review" ADD COLUMN IF NOT EXISTS "text" text`);
    await queryRunner.query(`ALTER TABLE "navigation" DROP COLUMN IF EXISTS "last_scraped_at"`);
  }
}
