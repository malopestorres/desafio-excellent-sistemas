import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  url: string;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId: number;
}