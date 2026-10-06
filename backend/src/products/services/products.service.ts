import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../orders/entities/order-item.entity.js';
import { Product } from '../entities/product.entity.js';
import { ProductImage } from '../entities/product-image.entity.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { UpdateProductDto } from '../dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly imagesRepository: Repository<ProductImage>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { images, ...productData } = createProductDto;

    const existing = await this.productsRepository.findOne({
      where: { id: createProductDto.id },
    });

    if (existing) {
      throw new ConflictException(
        `Já existe um produto com o ID ${createProductDto.id}`,
      );
    }

    const product = this.productsRepository.create(productData);

    if (images && images.length > 0) {
      product.images = images.map((url) =>
        this.imagesRepository.create({ url }),
      );
    }

    return this.productsRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    const { images, ...productData } = updateProductDto;

    if (images) {
      await this.imagesRepository.delete({ product: { id } });
      product.images = images.map((url) =>
        this.imagesRepository.create({ url }),
      );
    }

    const updated = this.productsRepository.merge(product, productData);

    return this.productsRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    const references = await this.orderItemsRepository.count({
      where: { product: { id } },
    });

    if (references > 0) {
      throw new ConflictException(
        'Não é possível excluir um produto que está vinculado a um pedido',
      );
    }

    await this.productsRepository.remove(product);
  }
}