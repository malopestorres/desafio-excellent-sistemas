import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity.js';
import { Order } from '../orders/entities/order.entity.js';
import { OrderItem } from '../orders/entities/order-item.entity.js';
import { Product } from '../products/entities/product.entity.js';

interface SeedProduct {
  description: string;
  salePrice: number;
  stock: number;
}

interface SeedClient {
  companyName: string;
  cnpj: string;
  email: string;
}

interface SeedOrder {
  clientIndex: number;
  items: Array<{ productIndex: number; quantity: number }>;
}

const PRODUCTS: SeedProduct[] = [
  { description: 'Notebook', salePrice: 5000, stock: 10 },
  { description: 'Mouse', salePrice: 150, stock: 30 },
  { description: 'Teclado', salePrice: 300, stock: 15 },
];

const CLIENTS: SeedClient[] = [
  {
    companyName: 'Aurora Comércio de Alimentos Ltda.',
    cnpj: '12345678000190',
    email: 'contato@aurora.exemplo.com',
  },
  {
    companyName: 'Ipê Soluções Digitais Ltda.',
    cnpj: '23456789000101',
    email: 'comercial@ipe.exemplo.com',
  },
  {
    companyName: 'Horizonte Materiais de Construção Ltda.',
    cnpj: '34567890000112',
    email: 'vendas@horizonte.exemplo.com',
  },
  {
    companyName: 'Vereda Serviços de Logística Ltda.',
    cnpj: '45678901000123',
    email: 'contato@vereda.exemplo.com',
  },
  {
    companyName: 'Jatobá Indústria de Móveis Ltda.',
    cnpj: '56789012000134',
    email: 'comercial@jatoba.exemplo.com',
  },
];

const ORDERS: SeedOrder[] = [
  {
    clientIndex: 0,
    items: [
      { productIndex: 0, quantity: 1 },
      { productIndex: 1, quantity: 2 },
    ],
  },
  {
    clientIndex: 1,
    items: [
      { productIndex: 2, quantity: 1 },
      { productIndex: 1, quantity: 3 },
    ],
  },
  {
    clientIndex: 2,
    items: [{ productIndex: 0, quantity: 2 }],
  },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemsRepository: Repository<OrderItem>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const hasData =
      (await this.productsRepository.count()) > 0 ||
      (await this.clientsRepository.count()) > 0 ||
      (await this.ordersRepository.count()) > 0;

    if (hasData) {
      return;
    }

    const products = await this.productsRepository.save(
      this.productsRepository.create(PRODUCTS),
    );
    const clients = await this.clientsRepository.save(
      this.clientsRepository.create(CLIENTS),
    );

    const orders: Order[] = [];
    for (const seedOrder of ORDERS) {
      const { clientIndex, items } = seedOrder;
      const order = this.ordersRepository.create({
        client: clients[clientIndex],
        totalAmount: 0,
      });
      order.items = items.map(({ productIndex, quantity }) => {
        const product = products[productIndex];
        const unitPrice = Number(product.salePrice);
        order.totalAmount += unitPrice * quantity;
        return this.itemsRepository.create({
          product,
          quantity,
          unitPrice,
        });
      });
      orders.push(order);
    }

    await this.ordersRepository.save(orders);
    this.logger.log(
      `Seed aplicado: ${products.length} produtos, ${clients.length} clientes e ${orders.length} pedidos padrão.`,
    );
  }
}