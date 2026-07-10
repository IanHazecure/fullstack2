import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../../components/header/header';
import { AuthService, User } from '../../../services/auth';
import { PurchasesService } from '../../../services/purchases';

@Component({
  selector: 'app-admindashboard',
  imports: [Header, RouterLink, CommonModule],
  templateUrl: './admindashboard.html',
  styleUrl: './admindashboard.css',
})
export class AdminDashboard implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private purchasesService = inject(PurchasesService);

  currentUser = signal(this.auth.getCurrentUser());
  users = signal<User[]>([]);
  products = signal<any[]>([]);
  alertMessage = signal('');
  alertType = signal('');
  activeTab = signal<'users' | 'products' | 'preorders'>('users');
  totalRevenue = signal(0);

  ngOnInit() {
    if (!this.currentUser()) { this.router.navigate(['/login']); return; }
    if (this.currentUser()?.role !== 'admin') { this.router.navigate(['/']); return; }
    this.users.set(this.auth.getUsers());
    this.totalRevenue.set(this.purchasesService.getTotalRevenue());

    this.http.get<any>('/vinyls.json').subscribe(data => {
      const purchases = this.purchasesService.getAll();
      const all = [
        ...data.pop.map((v: any) => ({ ...v, category: 'Pop' })),
        ...data.rock.map((v: any) => ({ ...v, category: 'Rock' })),
        ...data.jazz.map((v: any) => ({ ...v, category: 'Jazz' })),
        ...data.punk.map((v: any) => ({ ...v, category: 'Punk' })),
        ...(data.rap || []).map((v: any) => ({ ...v, category: 'Rap' })),
        ...(data.latina || []).map((v: any) => ({ ...v, category: 'Latina' })),
      ].map(v => ({
        ...v,
        unitsSold: purchases[v.id]?.quantity || 0,
        totalSold: purchases[v.id]?.totalSpent || 0
      }));
      this.products.set(all);
    });
  }

  deleteUser(userId: string) {
    const removed = this.auth.deleteUserById(userId);
    if (!removed) {
      this.alertMessage.set('No se pudo eliminar el usuario.');
      this.alertType.set('danger');
      return;
    }
    this.alertMessage.set('Usuario eliminado.');
    this.alertType.set('success');
    this.users.set(this.auth.getUsers());
  }

  isCurrentUser(userId: string) {
    return this.currentUser()?.id === userId;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}