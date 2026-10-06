import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Client } from './entities/client.entity.js';
import { ClientsController } from './clients.controller.js';
import { ClientsService } from './clients.service.js';
import { CnpjService } from './cnpj.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),  // Registra a entidade Client
    HttpModule,                          // Habilita HttpService (axios)
  ],
  controllers: [ClientsController],      // Registra o controller
  providers: [ClientsService, CnpjService], // Registra os services
  exports: [ClientsService],             // Exporta para outros módulos usarem
})
export class ClientsModule {}