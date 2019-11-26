import { TestBed } from '@angular/core/testing';

import { ServiceNameService } from './service-name.service';

describe('ServiceNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceNameService = TestBed.get(ServiceNameService);
    expect(service).toBeTruthy();
  });
});
