import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ClientPayload {
  id: number;
  companyName: string;
  cnpj: string;
  email: string;
}

export interface ClientResponse extends ClientPayload {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly baseUrl = 'http://localhost:3000/clients';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<ClientResponse[]> {
    return this.http.get<ClientResponse[]>(this.baseUrl);
  }

  findByCnpj(cnpj: string): Observable<Partial<ClientPayload>> {
    return this.http.get<Partial<ClientPayload>>(
      `${this.baseUrl}/cnpj/${cnpj}`,
    );
  }

  create(payload: ClientPayload): Observable<unknown> {
    return this.http.post(this.baseUrl, payload);
  }
}