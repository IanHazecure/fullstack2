import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { AuthService, User } from '../../../services/auth';
import { PurchasesService } from '../../../services/purchases';
import { Product, ProductsJsonServerService } from '../../../services/products-json-server.service';
import { resolveCoverUrl } from '../../../utils/cover-url';

export interface Vinyl extends Product {
  id: string;
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
  private purchasesService = inject(PurchasesService);
  private productsService = inject(ProductsJsonServerService);

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
    this.productsService.getAll().subscribe({
      next: data => {
        const purchases = this.purchasesService.getAll();
        this.products.set(data.map(v => ({
          ...v,
          unitsSold: purchases[v.id ?? '']?.quantity || 0,
          totalSold: purchases[v.id ?? '']?.totalSpent || 0
        })));
      },
      error: () => this.showAlert('Couldnt connect to json-server.', 'danger')
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
    const request = this.editingProduct()
      ? this.productsService.update(this.form.id, this.form)
      : this.productsService.create(this.form);

    request.subscribe({
      next: () => {
        this.loadProducts();
        this.resetForm();
        this.showAlert('Producto guardado.', 'success');
      },
      error: () => this.showAlert('No se pudo guardar el producto.', 'danger')
    });
  }

  deleteProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productsService.delete(id).subscribe({
      next: () => {
        this.loadProducts();
        this.showAlert('Producto eliminado.', 'success');
      },
      error: () => this.showAlert('No se pudo eliminar el producto.', 'danger')
    });
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

  coverUrl(cover: string | undefined | null): string {
    return resolveCoverUrl(cover);
  }

  showAlert(msg: string, type: string) {
    this.alertMessage.set(msg);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(''), 3000);
  }

  categories = ['Pop', 'Rock', 'Jazz', 'Punk', 'Rap', 'Latina'];
}