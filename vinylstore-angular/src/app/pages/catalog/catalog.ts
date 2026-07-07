import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../components/header/header';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  allProducts = signal<any[]>([]);
  filters = signal<string[]>([]);

  genres = ['Rock', 'Pop', 'Jazz', 'Punk', 'Rap', 'Metal'];

  get filtered() {
    const active = this.filters();
    if (active.length === 0) return this.allProducts();
    return this.allProducts().filter(p => active.includes(p.category));
  }

  ngOnInit() {
    this.http.get<any>('/vinyls.json').subscribe(data => {
      const all = [
  ...data.rock.map((v: any) => ({ ...v, category: 'Rock' })),
  ...data.pop.map((v: any) => ({ ...v, category: 'Pop' })),
  ...data.jazz.map((v: any) => ({ ...v, category: 'Jazz' })),
  ...data.punk.map((v: any) => ({ ...v, category: 'Punk' })),
  ...data.rap.map((v: any) => ({ ...v, category: 'Rap' })),
  ...data.metal.map((v: any) => ({ ...v, category: 'Metal' }))
];
      this.allProducts.set(all);
    });
  }

  toggleFilter(genre: string) {
    const current = this.filters();
    if (current.includes(genre)) {
      this.filters.set(current.filter(g => g !== genre));
    } else {
      this.filters.set([...current, genre]);
    }
  }

  isActive(genre: string) {
    return this.filters().includes(genre);
  }

  addToCart(vinyl: any) {
    this.cartService.addToCart(vinyl);
  }

  formatPrice(price: number) {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}