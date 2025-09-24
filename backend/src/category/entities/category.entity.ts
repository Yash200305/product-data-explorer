// src/category/entities/category.entity.ts
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Navigation } from '../../navigation/entities/navigation.entity';

@Entity({ name: 'category' })
@Index(['lastScrapedAt'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // Optional: link back to a top-level Navigation collection
  @ManyToOne(() => Navigation, (nav) => nav.categories, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  navigation?: Navigation | null;

  @Column({ name: 'navigation_id', type: 'int', nullable: true })
  navigationId?: number;

  // Self-referencing tree (Adjacency List pattern)
  @ManyToOne(() => Category, (c) => c.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Category | null;

  @OneToMany(() => Category, (c) => c.parent)
  children: Category[];

  @Column({ type: 'text' })
  title: string;

  // Unique slug used for upserts from scraping
  @Index({ unique: true })
  @Column({ type: 'text' })
  slug: string;

  // Used by scraper to track freshness
  @Column({ name: 'last_scraped_at', type: 'timestamptz', nullable: true })
  lastScrapedAt: Date | null;
}
