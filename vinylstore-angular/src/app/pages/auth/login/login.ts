import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Header } from '../../../components/header/header';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [Header, RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  alertMessage = '';
  alertType = '';

  form: FormGroup = this.fb.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get identifier() {
    return this.form.get('identifier');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.alertMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertMessage = 'Por favor completa todos los campos correctamente.';
      this.alertType = 'danger';
      return;
    }

    const { identifier, password } = this.form.value;
    const result = this.auth.authenticateUser(identifier, password);

    if (!result.ok) {
      this.alertMessage = result.message!;
      this.alertType = 'danger';
      return;
    }

    this.router.navigate(['/']);
  }
}