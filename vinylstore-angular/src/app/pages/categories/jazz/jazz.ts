import { Component, inject } from '@angular/core';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-jazz',
  imports: [Header, CategoryNav],
  templateUrl: './jazz.html',
  styleUrl: './jazz.css',
})
export class Jazz {
  private cartService = inject(CartService);

  addToCart(vinyl: {
    id: string;
    title: string;
    genre: string;
    price: number;
    cover: string;
    hasDiscount: boolean;
  }) {
    this.cartService.addToCart(vinyl);
  }
}