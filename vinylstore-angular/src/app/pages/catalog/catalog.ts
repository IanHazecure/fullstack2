import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { Product, ProductsJsonServerService } from '../../services/products-json-server.service';
import { resolveCoverUrl } from '../../utils/cover-url'; //api musicbraiinza
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
///buscador


export class Catalog implements OnInit {
  private cartService = inject(CartService);
  private productsService = inject(ProductsJsonServerService);

  allProducts = signal<Product[]>([]);
  filters = signal<string[]>([]);

  genres = ['Rock', 'Pop', 'Jazz', 'Punk', 'Rap', 'Metal'];

  get filtered() {
    const active = this.filters();
    if (active.length === 0) return this.allProducts();
    return this.allProducts().filter(p => active.includes(p.category));
  }

  ngOnInit() {
    this.productsService.getAll().subscribe({
      next: data => this.allProducts.set(data),
      error: () => this.allProducts.set([])
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

  coverUrl(cover: string | undefined | null): string {
    return resolveCoverUrl(cover);
  }

  formatPrice(price: number) {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  ////descuento % real esta vez
  discountedPrice(price: number, percent: number | undefined): number {
  if (!percent) return price;
  return Math.round(price - (price * percent / 100));
}
searchQuery = signal('');

get filtered() {///buscador
  const active = this.filters();
  const query = this.searchQuery().toLowerCase().trim();

  if (active.length === 0 && !query) return this.allProducts();
  });
}


}