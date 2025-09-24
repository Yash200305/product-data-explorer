// src/navigation/entities/navigation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity({ name: 'navigation' })
export class Navigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ name: 'last_scraped_at', type: 'timestamptz', nullable: true })
  lastScrapedAt?: Date | null;

  @OneToMany(() => Category, (category) => category.navigation)
  categories: Category[];

  
}
