import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  description: string;
  salePrice: number;
  stock: number;
  images: string[];
}

export interface ProductPayload {
  id?: number;
  description: string;
  salePrice: number;
  stock: number;
  images?: string[];
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly baseUrl = 'http://localhost:3000/products';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  findOne(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, payload);
  }

  uploadImages(formData: FormData): Observable<{ urls: string[] }> {
    return this.http.post<{ urls: string[] }>(
      `${this.baseUrl}/images/upload`,
      formData,
    );
  }
}