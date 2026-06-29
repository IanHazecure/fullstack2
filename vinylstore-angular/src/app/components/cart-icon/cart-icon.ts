import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { CartSidebar } from '../cart-sidebar/cart-sidebar';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, CartSidebar],
  templateUrl: './cart-icon.html',
  styleUrl: './cart-icon.css'
})
export class CartIcon {
  cartService = inject(CartService);
  isOpen = signal(false);

  toggleCart(): void {
    this.isOpen.update(v => !v);
  }

  closeCart(): void {
    this.isOpen.set(false);
  }
}