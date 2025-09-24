import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_detail' })
export class ProductDetail {
  @PrimaryColumn({ name: 'product_id', type: 'int' })
  productId!: number;

  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  specs?: Record<string, any> | null;

  @Column({ name: 'ratings_avg', type: 'numeric', precision: 4, scale: 2, nullable: true })
  ratingsAvg?: string | null;

  @Column({ name: 'reviews_count', type: 'int', default: 0 })
  reviewsCount!: number;
}
