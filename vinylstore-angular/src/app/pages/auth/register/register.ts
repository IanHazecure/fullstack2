import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  alertMessage = '';
  alertType = '';

  form: FormGroup = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]],
      confirmPassword: ['', [Validators.required]],
      shippingAddress: [''],
    },
    { validators: passwordsMatchValidator }
  );

  get fullName() { return this.form.get('fullName'); }
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get birthDate() { return this.form.get('birthDate'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  onSubmit() {
    this.alertMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.errors?.['passwordsMismatch']) {
        this.alertMessage = 'Las contraseñas deben coincidir.';
      } else {
        this.alertMessage = 'Por favor completa todos los campos obligatorios correctamente.';
      }
      this.alertType = 'danger';
      return;
    }

    const result = this.auth.registerUser(this.form.value);

    if (!result.ok) {
      this.alertMessage = result.message!;
      this.alertType = 'danger';
      return;
    }

    this.alertMessage = 'Cuenta creada Redirigiendo...';
    this.alertType = 'success';
    setTimeout(() => this.router.navigate(['/login']), 1500);
  }

  clearForm() {
    this.form.reset();
    this.alertMessage = '';
  }
}