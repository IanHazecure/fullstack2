import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Catalog } from './catalog';
import { ProductsJsonServerService } from '../../services/products-json-server.service';

describe('Catalog', () => {
  let component: Catalog;
  let fixture: ComponentFixture<Catalog>;

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj<ProductsJsonServerService>('ProductsJsonServerService', ['getAll']);
    productsServiceSpy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Catalog],
      providers: [{ provide: ProductsJsonServerService, useValue: productsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Catalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
