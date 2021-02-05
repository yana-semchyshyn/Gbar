import { TestBed } from '@angular/core/testing';

import { GbarsService } from './gbars.service';

describe('GbarsService', () => {
  let service: GbarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GbarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
