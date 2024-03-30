import { TestBed } from '@angular/core/testing';

import { CoursedetailService } from './coursedetail.service';

describe('CoursedetailService', () => {
  let service: CoursedetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursedetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
