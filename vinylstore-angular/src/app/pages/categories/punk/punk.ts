import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-punk',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, Header, CategoryNav],
  templateUrl: './punk.html',
  styleUrl: './punk.css',
})
export class Punk implements OnInit {
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  albums = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any>('/vinyls.json').subscribe(data => {
      this.albums.set(data.punk);
    });
  }

  addToCart(vinyl: any) {
    this.cartService.addToCart(vinyl);
  }
}