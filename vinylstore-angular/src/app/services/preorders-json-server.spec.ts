import { TestBed } from '@angular/core/testing';

import { PreordersJsonServer } from './preorders-json-server';

describe('PreordersJsonServer', () => {
  let service: PreordersJsonServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreordersJsonServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
