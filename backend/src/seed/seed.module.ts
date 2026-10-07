import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity.js';
import { OrderItem } from '../orders/entities/order-item.entity.js';
import { Client } from '../clients/entities/client.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { ProductImage } from '../products/entities/product-image.entity.js';
import { SeedService } from './seed.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Client,
      Order,
      OrderItem,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
