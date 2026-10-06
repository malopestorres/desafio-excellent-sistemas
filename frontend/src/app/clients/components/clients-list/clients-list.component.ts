import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';

export interface Client {
  id: string;
  companyName: string;
  cnpj: string;
  email: string;
}

@Component({
  selector: 'app-clients-list',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
})
export class ClientsListComponent {
  private readonly router = inject(Router);

  displayedColumns: string[] = ['id', 'companyName', 'cnpj', 'email', 'actions'];

  clients: Client[] = [
    {
      id: '001',
      companyName: 'Aurora Comércio de Alimentos Ltda.',
      cnpj: '12.345.678/0001-90',
      email: 'contato@aurora.exemplo.com',
    },
    {
      id: '002',
      companyName: 'Ipê Soluções Digitais Ltda.',
      cnpj: '23.456.789/0001-01',
      email: 'comercial@ipe.exemplo.com',
    },
    {
      id: '003',
      companyName: 'Horizonte Materiais de Construção Ltda.',
      cnpj: '34.567.890/0001-12',
      email: 'vendas@horizonte.exemplo.com',
    },
    {
      id: '004',
      companyName: 'Vereda Serviços de Logística Ltda.',
      cnpj: '45.678.901/0001-23',
      email: 'contato@vereda.exemplo.com',
    },
    {
      id: '005',
      companyName: 'Jatobá Indústria de Móveis Ltda.',
      cnpj: '56.789.012/0001-34',
      email: 'comercial@jatoba.exemplo.com',
    },
  ];

  editClient(client: Client): void {
    void client;
  }

  navigateToForm(): void {
    this.router.navigate(['/clientes/cadastro']);
  }

  deleteClient(client: Client): void {
    this.clients = this.clients.filter((item) => item.id !== client.id);
  }
}
