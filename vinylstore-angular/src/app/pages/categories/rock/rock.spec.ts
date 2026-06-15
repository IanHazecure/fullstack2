import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rock } from './rock';

describe('Rock', () => {
  let component: Rock;
  let fixture: ComponentFixture<Rock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rock],
    }).compileComponents();

    fixture = TestBed.createComponent(Rock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
