import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rock } from './rock';
import { provideRouter } from '@angular/router';

describe('Rock', () => {
  let component: Rock;
  let fixture: ComponentFixture<Rock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rock],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Rock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
