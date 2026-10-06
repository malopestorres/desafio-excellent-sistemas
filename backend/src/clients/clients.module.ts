import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Client } from './entities/client.entity.js';
import { ClientsController } from './clients.controller.js';
import { ClientsService } from './clients.service.js';
import { CnpjService } from './cnpj.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), HttpModule],
  controllers: [ClientsController],
  providers: [ClientsService, CnpjService],
  exports: [ClientsService],
})
export class ClientsModule {}