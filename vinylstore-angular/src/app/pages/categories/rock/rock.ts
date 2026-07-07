import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';
import { CartService } from '../../../services/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rock',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, Header, CategoryNav],
  templateUrl: './rock.html',
  styleUrl: './rock.css',
})
export class Rock implements OnInit {
  private cartService = inject(CartService);
  private http = inject(HttpClient);
  albums = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any>('/vinyls.json').subscribe(data => {
      this.albums.set(data.rock);
    });
  }

  addToCart(vinyl: any) {
    this.cartService.addToCart(vinyl);
  }
}