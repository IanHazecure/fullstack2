import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartIcon } from '../cart-icon/cart-icon';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CartIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cartService = inject(CartService);
  menuOpen = signal(false);

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  get isAdmin() {
    return this.currentUser?.role === 'admin';
  }

  logout() {
    this.auth.logout();
    this.cartService.refreshCart();
    this.menuOpen.set(false);
    this.router.navigate(['/']);
  }

  closeTimeout: any;

startClose() {
  this.closeTimeout = setTimeout(() => this.menuOpen.set(false), 150);
}

cancelClose() {
  clearTimeout(this.closeTimeout);
}
}