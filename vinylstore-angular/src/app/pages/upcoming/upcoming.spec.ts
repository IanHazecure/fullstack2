import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Upcoming } from './upcoming';
import { PreordersJsonServerService } from '../../services/preorders-json-server';

describe('Upcoming', () => {
  let component: Upcoming;
  let fixture: ComponentFixture<Upcoming>;

  beforeEach(async () => {
    const preordersServiceSpy = jasmine.createSpyObj<PreordersJsonServerService>('PreordersJsonServerService', ['getAll']);
    preordersServiceSpy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Upcoming],
      providers: [{ provide: PreordersJsonServerService, useValue: preordersServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Upcoming);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
