import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { ProductImage } from './product-image.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  salePrice: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  stock: number;

  @OneToMany(() => ProductImage, (image) => image.productId, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  images: ProductImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}