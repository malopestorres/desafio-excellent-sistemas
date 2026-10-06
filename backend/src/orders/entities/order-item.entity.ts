import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import { Order } from './order.entity.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Relation<Product>;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  unitPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}