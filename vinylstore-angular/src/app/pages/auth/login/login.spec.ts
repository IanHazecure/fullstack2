import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debería ser inválido si está vacío', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('identifier debería ser inválido con menos de 3 caracteres', () => {
    component.identifier?.setValue('ab');
    expect(component.identifier?.valid).toBeFalse();
  });

  it('password debería ser inválido con menos de 6 caracteres', () => {
    component.password?.setValue('123');
    expect(component.password?.valid).toBeFalse();
  });

  it('el formulario debería ser válido con datos correctos', () => {
    component.form.setValue({ identifier: 'admin', password: 'Admin123' });
    expect(component.form.valid).toBeTrue();
  });

  it('no debería autenticar si el formulario es inválido', () => {
    spyOn(component['auth'], 'authenticateUser');
    component.onSubmit();
    expect(component['auth'].authenticateUser).not.toHaveBeenCalled();
  });
});