import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth';

export interface Vinyl {
  id: string;
  title: string;
  genre: string;
  price: number;
  cover: string;
  hasDiscount: boolean;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private auth = inject(AuthService);

  private cartItems = signal<Vinyl[]>(this.loadFromStorage());

  items = computed(() => this.cartItems());
  totalItems = computed(() => this.cartItems().reduce((sum, v) => sum + v.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((sum, v) => sum + v.price * v.quantity, 0));

  private getStorageKey(): string | null {
    const user = this.auth.getCurrentUser();
    return user ? `vinyl_cart_${user.id}` : null;
  }

  private loadFromStorage(): Vinyl[] {
    const key = this.getStorageKey();
    if (!key) return [];
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: Vinyl[]): void {
    const key = this.getStorageKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(items));
  }


  refreshCart(): void {
    this.cartItems.set(this.loadFromStorage());
  }

  addToCart(vinyl: Omit<Vinyl, 'quantity'>): void {
    if (!this.getStorageKey()) return; 
    const current = this.cartItems();
    const existing = current.find(v => v.id === vinyl.id);

    let updated: Vinyl[];
    if (existing) {
      updated = current.map(v => v.id === vinyl.id ? { ...v, quantity: v.quantity + 1 } : v);
    } else {
      updated = [...current, { ...vinyl, quantity: 1 }];
    }

    this.cartItems.set(updated);
    this.saveToStorage(updated);
  }

  removeFromCart(id: string): void {
    const updated = this.cartItems().filter(v => v.id !== id);
    this.cartItems.set(updated);
    this.saveToStorage(updated);
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) { this.removeFromCart(id); return; }
    const updated = this.cartItems().map(v => v.id === id ? { ...v, quantity } : v);
    this.cartItems.set(updated);
    this.saveToStorage(updated);
  }

  clearCart(): void {
    this.cartItems.set([]);
    const key = this.getStorageKey();
    if (key) localStorage.removeItem(key);
  }
}