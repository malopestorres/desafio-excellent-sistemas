import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { OrderResponse, OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-list',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);

  displayedColumns: string[] = [
    'id',
    'client',
    'items',
    'totalAmount',
    'date',
    'actions',
  ];

  orders = signal<OrderResponse[]>([]);

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.ordersService.findAll().subscribe((orders) => {
      this.orders.set(orders);
    });
  }

  formatId(id: number): string {
    return String(id).padStart(2, '0');
  }

  formatPrice(value: string): string {
    return 'R$ ' + Number(value).toLocaleString('pt-BR');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  navigateToForm(): void {
    this.router.navigate(['/pedidos/novo']);
  }

  deleteOrder(order: OrderResponse): void {
    this.ordersService.remove(order.id).subscribe({
      next: () => {
        this.orders.update((list) =>
          list.filter((item) => item.id !== order.id),
        );
      },
    });
  }
}