import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Client } from './entities/client.entity.js';
import { ClientsController } from './controllers/clients.controller.js';
import { ClientsService } from './services/clients.service.js';
import { CnpjService } from './services/cnpj.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), HttpModule],
  controllers: [ClientsController],
  providers: [ClientsService, CnpjService],
  exports: [ClientsService],
})
export class ClientsModule {}