import { TestBed } from '@angular/core/testing';

import { StudentDepartmentserviceService } from './student-departmentservice.service';

describe('StudentDepartmentserviceService', () => {
  let service: StudentDepartmentserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentDepartmentserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
