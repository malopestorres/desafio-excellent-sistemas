import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OrderProductResponse {
  id: number;
  description: string;
  salePrice: string;
  stock: number;
}

export interface OrderClientResponse {
  id: number;
  companyName: string;
}

export interface OrderItemResponse {
  id: number;
  product: OrderProductResponse;
  quantity: number;
  unitPrice: string;
}

export interface OrderResponse {
  id: number;
  client: OrderClientResponse;
  items: OrderItemResponse[];
  totalAmount: string;
  createdAt: string;
}

export interface OrderItemPayload {
  productId: number;
  quantity: number;
}

export interface OrderPayload {
  clientId: number;
  items: OrderItemPayload[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly baseUrl = 'http://localhost:3000/orders';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.baseUrl);
  }

  create(payload: OrderPayload): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
