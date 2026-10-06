import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
import { UpdateClientDto } from '../dto/update-client.dto.js';
import { CnpjService } from './cnpj.service.js';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    private readonly cnpjService: CnpjService,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return client;
  }

  async findByCnpj(cnpj: string): Promise<Partial<Client>> {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');

    const existing = await this.clientsRepository.findOne({
      where: { cnpj: cleanCnpj },
    });

    const cnpjData = await this.cnpjService.findByCnpj(cleanCnpj);

    return {
      companyName: cnpjData.razao_social,
      cnpj: existing?.cnpj || cnpjData.cnpj,
      email: cnpjData.email,
    };
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const cleanCnpj = createClientDto.cnpj.replace(/[^\d]/g, '');

    const existing = await this.clientsRepository.findOne({
      where: { cnpj: cleanCnpj },
    });

    if (existing) {
      throw new ConflictException(
        `Cliente com CNPJ ${cleanCnpj} já cadastrado`,
      );
    }

    const client = this.clientsRepository.create({
      ...createClientDto,
      cnpj: cleanCnpj,
    });

    return this.clientsRepository.save(client);
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    if (updateClientDto.cnpj) {
      updateClientDto.cnpj = updateClientDto.cnpj.replace(/[^\d]/g, '');
    }

    const updated = this.clientsRepository.merge(client, updateClientDto);

    return this.clientsRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);

    await this.clientsRepository.remove(client);
  }
}
