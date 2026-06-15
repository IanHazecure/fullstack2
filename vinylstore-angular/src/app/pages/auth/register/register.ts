import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../components/header/header';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  imports: [Header, FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  formData = {
    fullName: '',
    username: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    shippingAddress: '',
  };

  alertMessage = '';
  alertType = '';

  onSubmit() {
    this.alertMessage = '';

    if (!this.formData.fullName || !this.formData.username || !this.formData.email || !this.formData.birthDate || !this.formData.password) {
      this.alertMessage = 'Por favor completa todos los campos obligatorios.';
      this.alertType = 'danger';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.alertMessage = 'Las contraseñas deben coincidir.';
      this.alertType = 'danger';
      return;
    }

    const result = this.auth.registerUser(this.formData);

    if (!result.ok) {
      this.alertMessage = result.message!;
      this.alertType = 'danger';
      return;
    }

    this.alertMessage = '¡Cuenta creada exitosamente! Redirigiendo...';
    this.alertType = 'success';
    setTimeout(() => this.router.navigate(['/login']), 1500);
  }

  clearForm() {
    this.formData = {
      fullName: '',
      username: '',
      email: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      shippingAddress: '',
    };
    this.alertMessage = '';
  }
}