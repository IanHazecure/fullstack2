import { TestBed } from '@angular/core/testing';
import { PreordersJsonServerService } from './preorders-json-server';

describe('PreordersJsonServerService', () => {
  let service: PreordersJsonServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreordersJsonServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});