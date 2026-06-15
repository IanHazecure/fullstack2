import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Header } from '../../../components/header/header';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [Header, RouterLink, FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  formData = {
    identifier: '',
    password: '',
  };

  alertMessage = '';
  alertType = '';

  onSubmit() {
    this.alertMessage = '';

    if (!this.formData.identifier || !this.formData.password) {
      this.alertMessage = 'Por favor completa todos los campos.';
      this.alertType = 'danger';
      return;
    }

    const result = this.auth.authenticateUser(this.formData.identifier, this.formData.password);

    if (!result.ok) {
      this.alertMessage = result.message!;
      this.alertType = 'danger';
      return;
    }

    this.router.navigate(['/']);
  }
}