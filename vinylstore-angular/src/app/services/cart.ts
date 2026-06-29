import { Injectable, signal, computed } from '@angular/core';

export interface Vinyl {
  id: string;
  title: string;
  genre: string;
  price: number;
  cover: string;
  hasDiscount: boolean;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'vinyl_cart';


  private cartItems = signal<Vinyl[]>(this.loadFromStorage());


  items = computed(() => this.cartItems());
  totalItems = computed(() => this.cartItems().reduce((sum, v) => sum + v.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((sum, v) => sum + v.price * v.quantity, 0));

  private loadFromStorage(): Vinyl[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: Vinyl[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  addToCart(vinyl: Omit<Vinyl, 'quantity'>): void {
    const current = this.cartItems();
    const existing = current.find(v => v.id === vinyl.id);

    let updated: Vinyl[];
    if (existing) {
      updated = current.map(v =>
        v.id === vinyl.id ? { ...v, quantity: v.quantity + 1 } : v
      );
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
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }
    const updated = this.cartItems().map(v =>
      v.id === id ? { ...v, quantity } : v
    );
    this.cartItems.set(updated);
    this.saveToStorage(updated);
  }

  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}