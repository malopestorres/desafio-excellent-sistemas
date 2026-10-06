import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';

export interface Product {
  id: string;
  description: string;
  salePrice: number;
  stock: number;
}

@Component({
  selector: 'app-products-list',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  private readonly router = inject(Router);

  displayedColumns: string[] = ['id', 'description', 'salePrice', 'stock', 'actions'];

  products: Product[] = [
    { id: '01', description: 'Notebook', salePrice: 5000, stock: 10 },
    { id: '02', description: 'Mouse', salePrice: 150, stock: 30 },
    { id: '03', description: 'Teclado', salePrice: 300, stock: 15 },
  ];

  formatPrice(value: number): string {
    return 'R$ ' + value.toLocaleString('pt-BR');
  }

  editProduct(product: Product): void {
    this.router.navigate(['/produtos/editar', product.id]);
  }

  navigateToForm(): void {
    this.router.navigate(['/produtos/novo']);
  }

  deleteProduct(product: Product): void {
    this.products = this.products.filter((item) => item.id !== product.id);
  }
}