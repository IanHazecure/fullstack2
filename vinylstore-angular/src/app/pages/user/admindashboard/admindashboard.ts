import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../../components/header/header';
import { AuthService, User } from '../../../services/auth';

@Component({
  selector: 'app-admindashboard',
  imports: [Header, RouterLink],
  templateUrl: './admindashboard.html',
  styleUrl: './admindashboard.css',
})
export class AdminDashboard implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  currentUser = signal(this.auth.getCurrentUser());
  users = signal<User[]>([]);
  alertMessage = signal('');
  alertType = signal('');

  ngOnInit() {
    if (!this.currentUser()) { this.router.navigate(['/login']); return; }
    if (this.currentUser()?.role !== 'admin') { this.router.navigate(['/']); return; }
    this.users.set(this.auth.getUsers());
  }

  deleteUser(userId: string) {
    const removed = this.auth.deleteUserById(userId);
    if (!removed) {
      this.alertMessage.set('No se pudo eliminar el usuario.');
      this.alertType.set('danger');
      return;
    }
    this.alertMessage.set('Usuario eliminado correctamente.');
    this.alertType.set('success');
    this.users.set(this.auth.getUsers());
  }

  isCurrentUser(userId: string) {
    return this.currentUser()?.id === userId;
  }
}