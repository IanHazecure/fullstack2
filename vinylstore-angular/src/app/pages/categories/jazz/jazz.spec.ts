import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jazz } from './jazz';
import { provideRouter } from '@angular/router';

describe('Jazz', () => {
  let component: Jazz;
  let fixture: ComponentFixture<Jazz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jazz],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Jazz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
