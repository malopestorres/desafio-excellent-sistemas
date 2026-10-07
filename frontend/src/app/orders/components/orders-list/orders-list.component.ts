import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { OrderResponse, OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-list',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly dialog = inject(MatDialog);

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
    const data: ConfirmDialogData = {
      title: 'Excluir pedido',
      message: `Deseja realmente excluir o pedido #${this.formatId(order.id)}?`,
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '420px', maxWidth: '95vw' })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.ordersService.remove(order.id).subscribe({
          next: () => {
            this.orders.update((list) =>
              list.filter((item) => item.id !== order.id),
            );
          },
        });
      });
  }
}