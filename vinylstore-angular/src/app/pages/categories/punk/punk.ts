import { Component, inject } from '@angular/core';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-punk',
  imports: [Header, CategoryNav],
  templateUrl: './punk.html',
  styleUrl: './punk.css',
})
export class Punk {
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