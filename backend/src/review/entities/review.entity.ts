import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'review' })
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ name: 'product_id', type: 'int' })
  productId!: number;

  @Column({ type: 'text' })
  author!: string;

  @Column({ type: 'int', default: 0 })
  rating!: number;

  @Column({ type: 'text' })
  comment!: string;

  @Index('idx_review_created_at')
  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}
