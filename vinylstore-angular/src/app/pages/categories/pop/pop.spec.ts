import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pop } from './pop';
import { provideRouter } from '@angular/router';

describe('Pop', () => {
  let component: Pop;
  let fixture: ComponentFixture<Pop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pop],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Pop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
