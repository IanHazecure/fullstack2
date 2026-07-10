import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { PreordersJsonServerService, Preorder } from '../../services/preorders-json-server';

@Component({
  selector: 'app-preorders-json-server',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './preorders-json-server.html',
  styleUrl: './preorders-json-server.css'
})
export class PreordersJsonServer implements OnInit {
  private service = inject(PreordersJsonServerService);

  preorders = signal<Preorder[]>([]);
  alertMessage = signal('');
  alertType = signal('');
  editingId = signal<number | null>(null);

  form: Preorder = this.emptyForm();

  ngOnInit() {
    this.loadPreorders();
  }

  loadPreorders() {
    this.service.getAll().subscribe({
      next: (data) => this.preorders.set(data),
      error: () => this.showAlert('Couldnt connect to json-server.', 'danger')
    });
  }

  save() {
    if (this.editingId() !== null) {
      this.service.update(this.editingId()!, this.form).subscribe({
        next: () => { this.loadPreorders(); this.resetForm(); this.showAlert('Preorder updated.', 'success'); }
      });
    } else {
      this.service.create(this.form).subscribe({
        next: () => { this.loadPreorders(); this.resetForm(); this.showAlert('Preorder created.', 'success'); }
      });
    }
  }

  edit(preorder: Preorder) {
    this.editingId.set(preorder.id!);
    this.form = { ...preorder };
  }

  // delete(id: number) {
  //   this.service.delete(id).subscribe({
  //     next: () => { this.loadPreorders(); this.showAlert('Preorder deleted.', 'success'); }
  //   });
  // }  OBSOLETO, prefiero el de abajo que tiene confirmacion xd

  delete(id: number) {
  if (!confirm('are you sure?')) return;
  this.service.delete(id).subscribe({
    next: () => { this.loadPreorders(); this.showAlert('Preorder deleted.', 'success'); }
  });
}


  

  resetForm() {
    this.editingId.set(null);
    this.form = this.emptyForm();
  }

  emptyForm(): Preorder {
    return { title: '', artist: '', subtitle: '', genre: '', price: 0, releaseDate: '', status: 'Pre-order', cover: '' };
  }

  showAlert(msg: string, type: string) {
    this.alertMessage.set(msg);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(''), 3000);
  }

  formatPrice(price: number) {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}