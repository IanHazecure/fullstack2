import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-jazz',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, Header, CategoryNav],
  templateUrl: './jazz.html',
  styleUrl: './jazz.css',
})
export class Jazz implements OnInit {
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  albums = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any>('/vinyls.json').subscribe(data => {
      this.albums.set(data.jazz);
    });
  }

  addToCart(vinyl: any) {
    this.cartService.addToCart(vinyl);
  }
}