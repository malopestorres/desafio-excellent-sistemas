import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { Client } from '../clients/entities/client.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { OrdersController } from './controllers/orders.controller.js';
import { OrdersService } from './services/orders.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Client, Product]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}