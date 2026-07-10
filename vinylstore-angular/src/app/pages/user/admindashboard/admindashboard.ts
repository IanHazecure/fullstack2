import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../../components/header/header';
import { AuthService, User } from '../../../services/auth';
import { PurchasesService } from '../../../services/purchases';

export interface Vinyl {
  id: string;
  title: string;
  genre: string;
  category: string;
  price: number;
  cover: string;
  hasDiscount: boolean;
  discountPercent?: number;
  unitsSold?: number;
  totalSold?: number;
}

@Component({
  selector: 'app-admindashboard',
  imports: [Header, RouterLink, CommonModule, FormsModule],
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
  products = signal<Vinyl[]>([]);
  alertMessage = signal('');
  alertType = signal('');
  activeTab = signal<'users' | 'products' | 'preorders'>('users');
  totalRevenue = signal(0);
  editingProduct = signal<Vinyl | null>(null);
  showForm = signal(false);

  form: Vinyl = this.emptyForm();

  ngOnInit() {
    if (!this.currentUser()) { this.router.navigate(['/login']); return; }
    if (this.currentUser()?.role !== 'admin') { this.router.navigate(['/']); return; }
    this.users.set(this.auth.getUsers());
    this.totalRevenue.set(this.purchasesService.getTotalRevenue());
    this.loadProducts();
  }

  loadProducts() {
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

  emptyForm(): Vinyl {
    return { id: '', title: '', genre: '', category: 'Pop', price: 0, cover: '', hasDiscount: false, discountPercent: 0 };
  }

  editProduct(product: Vinyl) {
    this.editingProduct.set(product);
    this.form = { ...product };
    this.showForm.set(true);
  }

  saveProduct() {
    const current = this.products();
    if (this.editingProduct()) {
      const updated = current.map(p => p.id === this.form.id ? { ...this.form } : p);
      this.products.set(updated);
    } else {
      this.products.set([...current, { ...this.form }]);
    }
    this.resetForm();
    this.showAlert('Producto guardado.', 'success');
  }

  deleteProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.products.set(this.products().filter(p => p.id !== id));
    this.showAlert('Producto eliminado.', 'success');
  }

  resetForm() {
    this.form = this.emptyForm();
    this.editingProduct.set(null);
    this.showForm.set(false);
  }

  deleteUser(userId: string) {
    const removed = this.auth.deleteUserById(userId);
    if (!removed) { this.alertMessage.set('No se pudo eliminar.'); this.alertType.set('danger'); return; }
    this.alertMessage.set('Usuario eliminado.'); this.alertType.set('success');
    this.users.set(this.auth.getUsers());
  }

  isCurrentUser(userId: string) { return this.currentUser()?.id === userId; }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  discountedPrice(price: number, percent: number | undefined): number {
    if (!percent) return price;
    return Math.round(price - (price * percent / 100));
  }

  showAlert(msg: string, type: string) {
    this.alertMessage.set(msg);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(''), 3000);
  }

  categories = ['Pop', 'Rock', 'Jazz', 'Punk', 'Rap', 'Latina'];
}