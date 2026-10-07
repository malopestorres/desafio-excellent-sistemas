import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-form',
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
})
export class ProductsFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);

  isEdit = false;
  productId: number | null = null;
  replaceIndex: number | null = null;
  duplicateIdError = signal(false);
  images = signal<string[]>([]);

  form = this.fb.group({
    id: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(3)]],
    salePrice: [null as number | null, [Validators.required, Validators.min(0)]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) {
      this.isEdit = true;
      this.productId = Number(paramId);

      this.productsService.findOne(this.productId).subscribe({
        next: (product) => {
          this.form.patchValue({
            id: String(product.id).padStart(2, '0'),
            description: product.description,
            salePrice: Number(product.salePrice),
            stock: product.stock,
          });
          this.images.set((product.images ?? []).map((image) => image.url));
        },
        error: () => this.router.navigate(['/produtos']),
      });
    }
  }

  imageUrl(url: string): string {
    return url.startsWith('/uploads/') ? `http://localhost:3000${url}` : url;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadImages(input.files);
      input.value = '';
    }
  }

  onReplaceSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.replaceIndex !== null) {
      this.uploadImages(input.files, this.replaceIndex);
      input.value = '';
    }
  }

  onReplaceClick(index: number, input: HTMLInputElement): void {
    this.replaceIndex = index;
    input.value = '';
    input.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.uploadImages(event.dataTransfer.files);
    }
  }

  removeImage(index: number): void {
    this.images.set(this.images().filter((_, itemIndex) => itemIndex !== index));
  }

  private uploadImages(files: ArrayLike<File>, replaceIndex?: number): void {
    const fileList = Array.from(files);
    if (!fileList.length) {
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => formData.append('images', file));

    this.productsService.uploadImages(formData).subscribe({
      next: (result) => {
        if (replaceIndex !== undefined) {
          const next = [...this.images()];
          if (replaceIndex < next.length) {
            next[replaceIndex] = result.urls[0];
          } else {
            next.push(result.urls[0]);
          }
          this.images.set(next);
        } else {
          this.images.set([...this.images(), ...result.urls]);
        }
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, description, salePrice, stock } = this.form.getRawValue();
    const images = this.images();
    const base = {
      description: description ?? '',
      salePrice: Number(salePrice),
      stock: Number(stock),
      images,
    };

    const request =
      this.isEdit && this.productId !== null
        ? this.productsService.update(this.productId, base)
        : this.productsService.create({ ...base, id: Number(id) });

    request.subscribe({
      next: () => this.router.navigate(['/produtos']),
      error: () => {
        this.duplicateIdError.set(true);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/produtos']);
  }
}