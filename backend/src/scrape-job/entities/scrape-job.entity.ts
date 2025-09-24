import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export type ScrapeTargetType = 'navigation' | 'category' | 'products' | 'product-detail';
export type ScrapeStatus = 'queued' | 'running' | 'completed' | 'failed';

@Entity({ name: 'scrape_job' })
export class ScrapeJob {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('idx_scrape_target')
  @Column({ name: 'target_type', type: 'text' })
  targetType!: ScrapeTargetType;

  @Index('idx_scrape_target_key', { unique: true })
  @Column({ name: 'target_key', type: 'text' })
  targetKey!: string;

  @Column({ type: 'text', default: 'queued' })
  status!: ScrapeStatus;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt?: Date | null;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt?: Date | null;

  @Column({ name: 'error_log', type: 'text', nullable: true })
  errorLog?: string | null;
}
