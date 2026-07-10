import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  title: string;
  band?: string;
  genre: string;
  category: string;
  price: number;
  cover: string;
  hasDiscount: boolean;
  discountPercent?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsJsonServerService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/products';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  update(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}