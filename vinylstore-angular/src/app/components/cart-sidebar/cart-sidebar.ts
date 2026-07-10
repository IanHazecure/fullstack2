import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { PurchasesService } from '../../services/purchases';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css'
})

/////por mientras
export class CartSidebar {
  cartService = inject(CartService);
  purchasesService = inject(PurchasesService);

  isOpen = input<boolean>(false);
  close = output<void>();

  onClose(): void {
    this.close.emit();
  }

  checkout(): void {
    const items = this.cartService.items().map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      quantity: v.quantity,
      cover: v.cover,
      genre: v.genre
    }));

    if (items.length === 0) return;

    this.purchasesService.recordPurchase(items);
    this.cartService.clearCart();
    this.close.emit();
    alert('¡Compra realizada con éxito!');
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}/////