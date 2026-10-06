import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Client } from '../../clients/entities/client.entity.js';
import { OrderItem } from './order-item.entity.js';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Relation<Client>;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert', 'remove'],
    eager: true,
  })
  items: Relation<OrderItem[]>;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
    default: 0,
  })
  totalAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}