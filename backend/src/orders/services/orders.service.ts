import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity.js';
import { OrderItem } from '../entities/order-item.entity.js';
import { Client } from '../../clients/entities/client.entity.js';
import { Product } from '../../products/entities/product.entity.js';
import { CreateOrderDto } from '../dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemsRepository: Repository<OrderItem>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return order;
  }

  private async findProductOrThrow(productId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado`);
    }

    return product;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const client = await this.clientsRepository.findOne({
      where: { id: createOrderDto.clientId },
    });

    if (!client) {
      throw new NotFoundException(
        `Cliente com ID ${createOrderDto.clientId} não encontrado`,
      );
    }

    const items: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of createOrderDto.items) {
      const product = await this.findProductOrThrow(item.productId);

      if (item.quantity > product.stock) {
        throw new NotFoundException(
          `Estoque insuficiente para o produto ${product.description}`,
        );
      }

      const unitPrice = Number(product.salePrice);
      totalAmount += unitPrice * item.quantity;

      items.push(
        this.itemsRepository.create({
          product,
          quantity: item.quantity,
          unitPrice,
        }),
      );
    }

    const order = this.ordersRepository.create({
      client,
      items,
      totalAmount,
    });

    return this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);

    await this.ordersRepository.remove(order);
  }
}