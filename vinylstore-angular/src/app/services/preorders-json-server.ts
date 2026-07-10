import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Preorder {
  id?: number;
  title: string;
  artist: string;
  subtitle: string;
  genre: string;
  price: number;
  releaseDate: string;
  status: string;
  cover: string;
}

@Injectable({ providedIn: 'root' })
export class PreordersJsonServerService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/preorders';

  getAll(): Observable<Preorder[]> {
    return this.http.get<Preorder[]>(this.url);
  }

  create(preorder: Preorder): Observable<Preorder> {
    return this.http.post<Preorder>(this.url, preorder);
  }

  update(id: number, preorder: Preorder): Observable<Preorder> {
    return this.http.put<Preorder>(`${this.url}/${id}`, preorder);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}