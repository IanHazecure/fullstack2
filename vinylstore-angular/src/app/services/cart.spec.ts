import { TestBed } from '@angular/core/testing';
import { CartService } from './cart';
import { AuthService } from './auth';

describe('CartService', () => {
  let cartService: CartService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser = {
    id: 'user-123',
    fullName: 'Felipe Test',
    username: 'felipe',
    email: 'felipe@test.com',
    password: '1234',
    role: 'user' as const,
    birthDate: '2000-01-01',
    shippingAddress: 'Calle 123',
    recoveryCode: 'ABC',
    createdAt: new Date().toISOString()
  };

  const mockVinyl = {
    id: 'thriller',
    title: 'Thriller',
    genre: 'Pop/Disco',
    price: 45000,
    cover: '/covers/thriller.png',
    hasDiscount: true
  };

  beforeEach(() => {
    localStorage.clear();

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    cartService = TestBed.inject(CartService);
    cartService.refreshCart();
  });

  it('empty cart', () => {
    expect(cartService.items().length).toBe(0);
    expect(cartService.totalItems()).toBe(0);
  });

  it('add a vinyl', () => {
    cartService.addToCart(mockVinyl);

    expect(cartService.items().length).toBe(1);
    expect(cartService.items()[0].title).toBe('Thriller');
    expect(cartService.totalItems()).toBe(1);
  });

  it('increment quantity', () => {
    cartService.addToCart(mockVinyl);
    cartService.addToCart(mockVinyl);

    expect(cartService.items().length).toBe(1);
    expect(cartService.items()[0].quantity).toBe(2);
    expect(cartService.totalItems()).toBe(2);
  });

  it('total price', () => {
    cartService.addToCart(mockVinyl);
    cartService.addToCart(mockVinyl);

    expect(cartService.totalPrice()).toBe(90000);
  });

  it('remove vinyl', () => {
    cartService.addToCart(mockVinyl);
    cartService.removeFromCart('thriller');

    expect(cartService.items().length).toBe(0);
  });

  it('localStorage', () => {
    cartService.addToCart(mockVinyl);

    const stored = localStorage.getItem('vinyl_cart_user-123');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)[0].id).toBe('thriller');
  });

  it('clear the cart', () => {
    cartService.addToCart(mockVinyl);
    cartService.clearCart();

    expect(cartService.items().length).toBe(0);
    expect(localStorage.getItem('vinyl_cart_user-123')).toBeNull();
  });

  it('no cart no user', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
    cartService.addToCart(mockVinyl);

    expect(cartService.items().length).toBe(0);
  });
});