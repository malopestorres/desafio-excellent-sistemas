import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Product, ProductsService } from '../../services/products.service';

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
export class ProductsListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);

  displayedColumns: string[] = ['id', 'description', 'salePrice', 'stock', 'actions'];

  products = signal<Product[]>([]);

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
    this.productsService.remove(product.id).subscribe({
      next: () => {
        this.products.update((list) =>
          list.filter((item) => item.id !== product.id),
        );
      },
    });
  }
}
