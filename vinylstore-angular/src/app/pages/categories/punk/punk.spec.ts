import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Punk } from './punk';
import { provideRouter } from '@angular/router';

describe('Punk', () => {
  let component: Punk;
  let fixture: ComponentFixture<Punk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Punk],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Punk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
