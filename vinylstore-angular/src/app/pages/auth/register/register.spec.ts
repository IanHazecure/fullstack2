import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  const datosValidos = {
    fullName: 'Felipe Ruz',
    username: 'felipes',
    email: 'felipe@test.com',
    birthDate: '1998-12-30',
    password: '123456',
    confirmPassword: '123456',
    shippingAddress: '',
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario deberia ser invalido si está vacio', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('email deberia ser invalido con formato incorrecto', () => {
    component.email?.setValue('correo-malo');
    expect(component.email?.valid).toBeFalse();
  });

  it('password deberia ser invalido con menos de 6 caracteres', () => {
    component.password?.setValue('123');
    expect(component.password?.valid).toBeFalse();
  });

  it('el formulario deberia marcar error si las pass no coinciden', () => {
    component.form.setValue({ ...datosValidos, confirmPassword: 'otra-clave' });
    expect(component.form.errors?.['passwordsMismatch']).toBeTrue();
  });

  it('el formulario debería ser valido con datos correctos', () => {
    component.form.setValue(datosValidos);
    expect(component.form.valid).toBeTrue();
  });

  it('no deberia registrar si el formulario es invalido', () => {
    spyOn(component['auth'], 'registerUser');
    component.onSubmit();
    expect(component['auth'].registerUser).not.toHaveBeenCalled();
  });
});