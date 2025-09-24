import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ name: 'category_id', type: 'int' })
  categoryId!: number;

  @Index('uq_product_source_id', { unique: true })
  @Column({ name: 'source_id', type: 'text' })
  sourceId!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price?: string | null;

  @Column({ type: 'text', nullable: true })
  currency?: string | null;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string | null;

  @Column({ name: 'source_url', type: 'text' })
  sourceUrl!: string;

  @Index('idx_product_last_scraped_at')
  @Column({ name: 'last_scraped_at', type: 'timestamptz', nullable: true })
  lastScrapedAt?: Date | null;
}
