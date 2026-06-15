import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../components/header/header';
import { AuthService, User } from '../../../services/auth';

@Component({
  selector: 'app-profile',
  imports: [Header, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = signal<User | null>(null);
  formData = signal({ fullName: '', shippingAddress: '', recoveryCode: '', newPassword: '' });
  alertMessage = signal('');
  alertType = signal('');

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (!user) { this.router.navigate(['/login']); return; }
    this.user.set(user);
    this.formData.set({ fullName: user.fullName, shippingAddress: user.shippingAddress, recoveryCode: '', newPassword: '' });
  }

  onSubmit() {
    this.alertMessage.set('');
    const data = this.formData();
    const user = this.user();
    if (!data.fullName.trim()) {
      this.alertMessage.set('El nombre no puede quedar vacío.');
      this.alertType.set('danger');
      return;
    }

    const updated = { ...user! };
    updated.fullName = data.fullName.trim();
    updated.shippingAddress = data.shippingAddress.trim();

    if (data.newPassword) {
      if (!data.recoveryCode.trim()) {
        this.alertMessage.set('Debes ingresar el código de recuperación para cambiar la contraseña.');
        this.alertType.set('danger');
        return;
      }
      if (data.recoveryCode.trim() !== user!.recoveryCode) {
        this.alertMessage.set('El código de recuperación es incorrecto.');
        this.alertType.set('danger');
        return;
      }
      if (data.newPassword.length < 6) {
        this.alertMessage.set('La nueva contraseña debe tener al menos 6 caracteres.');
        this.alertType.set('danger');
        return;
      }
      updated.password = data.newPassword;
    }

    const ok = this.auth.updateUser(updated);
    if (!ok) {
      this.alertMessage.set('No se pudo actualizar el perfil.');
      this.alertType.set('danger');
      return;
    }

    this.user.set(this.auth.getCurrentUser());
    this.alertMessage.set('Perfil actualizado.');
    this.alertType.set('success');
    this.formData.update(f => ({ ...f, recoveryCode: '', newPassword: '' }));
  }
}