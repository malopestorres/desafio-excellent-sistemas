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
import { Product, ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-list',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'description', 'salePrice', 'stock', 'actions'];

  products = signal<Product[]>([]);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productsService.findAll().subscribe((products) => {
      this.products.set(products);
    });
  }

  formatId(id: number): string {
    return String(id).padStart(2, '0');
  }

  formatPrice(value: string | number): string {
    return 'R$ ' + Number(value).toLocaleString('pt-BR');
  }

  editProduct(product: Product): void {
    this.router.navigate(['/produtos/editar', product.id]);
  }

  navigateToForm(): void {
    this.router.navigate(['/produtos/novo']);
  }

  deleteProduct(product: Product): void {
    this.errorMessage.set(null);

    const data: ConfirmDialogData = {
      title: 'Excluir produto',
      message: `Deseja realmente excluir o produto "${product.description}"?`,
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
        this.productsService.remove(product.id).subscribe({
          next: () => {
            this.products.update((list) =>
              list.filter((item) => item.id !== product.id),
            );
          },
          error: (error: unknown) => {
            this.errorMessage.set(
              this.extractErrorMessage(error) ??
                'Não foi possível excluir o produto.',
            );
          },
        });
      });
  }

  private extractErrorMessage(error: unknown): string | null {
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof (error as { error?: unknown }).error === 'object' &&
      (error as { error?: { message?: unknown } }).error !== null
    ) {
      const apiMessage = (error as { error: { message?: unknown } }).error
        .message;
      if (typeof apiMessage === 'string' && apiMessage.length > 0) {
        return apiMessage;
      }
    }
    return null;
  }
}
