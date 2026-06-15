import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pop } from './pop';

describe('Pop', () => {
  let component: Pop;
  let fixture: ComponentFixture<Pop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pop],
    }).compileComponents();

    fixture = TestBed.createComponent(Pop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
