import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreordersJsonServer } from './preorders-json-server';

describe('PreordersJsonServer', () => {
  let component: PreordersJsonServer;
  let fixture: ComponentFixture<PreordersJsonServer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreordersJsonServer],
    }).compileComponents();

    fixture = TestBed.createComponent(PreordersJsonServer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
