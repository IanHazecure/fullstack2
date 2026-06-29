import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartIcon } from '../cart-icon/cart-icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CartIcon],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private auth = inject(AuthService);
  private router = inject(Router);

  get currentUser() {
    return this.auth.getCurrentUser();
  }

  get isAdmin() {
    return this.currentUser?.role === 'admin';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}