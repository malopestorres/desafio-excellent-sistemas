import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { ClientsService } from '../../../clients/services/clients.service';
import { ProductsService, Product } from '../../../products/services/products.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SubmittedErrorStateMatcher } from '../../../shared/utils/submitted-error-state-matcher';
import { OrdersService, OrderPayload } from '../../services/orders.service';

interface ClientOption {
  id: number;
  companyName: string;
}

@Component({
  selector: 'app-orders-form',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './orders-form.component.html',
  styleUrl: './orders-form.component.scss',
})
export class OrdersFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);
  private readonly productsService = inject(ProductsService);
  private readonly ordersService = inject(OrdersService);

  clients = signal<ClientOption[]>([]);
  products = signal<Product[]>([]);
  serverError = signal('');

  readonly errorMatcher = new SubmittedErrorStateMatcher();

  form = this.fb.group({
    clientId: [null as number | null, Validators.required],
    items: this.fb.array([]),
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor() {
    this.clientsService.findAll().subscribe((clients) => {
      this.clients.set(
        clients.map((client) => ({
          id: client.id,
          companyName: client.companyName,
        })),
      );
    });

    this.productsService.findAll().subscribe((products) => {
      this.products.set(products);
    });

    this.addItem();
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        productId: [null as number | null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      }),
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  itemProduct(index: number): Product | undefined {
    const productId = this.items.at(index)?.get('productId')?.value;
    return this.products().find((product) => product.id === productId);
  }

  subtotalText(index: number): string {
    const product = this.itemProduct(index);
    if (!product) {
      return 'R$ 0';
    }

    const quantity = Number(this.items.at(index).get('quantity')?.value ?? 0);
    const subtotal = Number(product.salePrice) * quantity;
    return 'R$ ' + subtotal.toLocaleString('pt-BR');
  }

  total(): number {
    let sum = 0;

    for (let i = 0; i < this.items.length; i++) {
      const product = this.itemProduct(i);
      const quantity = Number(this.items.at(i).get('quantity')?.value ?? 0);

      if (product) {
        sum += Number(product.salePrice) * quantity;
      }
    }

    return sum;
  }

  save(): void {
    if (this.form.invalid || !this.items.length) {
      this.errorMatcher.submitted = true;
      this.form.markAllAsTouched();
      return;
    }

    this.serverError.set('');

    const payload: OrderPayload = {
      clientId: Number(this.form.get('clientId')?.value),
      items: this.items.controls.map((group) => ({
        productId: Number(group.get('productId')?.value),
        quantity: Number(group.get('quantity')?.value),
      })),
    };

    this.ordersService.create(payload).subscribe({
      next: () => this.router.navigate(['/pedidos']),
      error: (err) => {
        const message = err?.error?.message;
        this.serverError.set(
          Array.isArray(message)
            ? message[0]
            : (message ?? 'Não foi possível salvar o pedido.'),
        );
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/pedidos']);
  }
}