import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AdminDashboard } from './admindashboard';
import { ProductsJsonServerService } from '../../../services/products-json-server.service';

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj<ProductsJsonServerService>('ProductsJsonServerService', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);
    productsServiceSpy.getAll.and.returnValue(of([]));
    productsServiceSpy.create.and.returnValue(of({} as any));
    productsServiceSpy.update.and.returnValue(of({} as any));
    productsServiceSpy.delete.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [
        provideRouter([]),
        { provide: ProductsJsonServerService, useValue: productsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});