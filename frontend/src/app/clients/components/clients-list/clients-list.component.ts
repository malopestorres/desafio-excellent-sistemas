import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ClientResponse, ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-clients-list',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
})
export class ClientsListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);

  displayedColumns: string[] = ['id', 'companyName', 'cnpj', 'email'];

  clients = signal<ClientResponse[]>([]);
  isLoading = signal(true);

  readonly skeletonRows: ClientResponse[] = Array.from(
    { length: 5 },
    () => ({}) as ClientResponse,
  );

  ngOnInit(): void {
    this.loadClients();
  }

  private loadClients(): void {
    this.isLoading.set(true);
    this.clientsService.findAll().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  formatId(id: number): string {
    return String(id).padStart(2, '0');
  }

  formatCnpj(cnpj: string): string {
    const digits = cnpj.replace(/\D/g, '');
    if (digits.length !== 14) {
      return cnpj;
    }
    return digits.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }

  navigateToForm(): void {
    this.router.navigate(['/clientes/cadastro']);
  }
}
