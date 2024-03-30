import { Injectable } from '@angular/core';
import { StudentService } from './student.service';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Students } from '../model/student'; // Adjust the path as per your project structure

@Injectable({
  providedIn: 'root'
})
export class StudentDepartmentService {

  constructor(private studentService: StudentService) { }

  fetchStudentDepartmentByEmail(email: string): Observable<string> {
    return this.studentService.getStudentByEmail(email).pipe(
      map((students: Students[]) => {
        // Assuming there's only one student for the given email, otherwise, you need to handle multiple students
        const student = students[0];
        if (student) {
          return student.department;
        } else {
          throw new Error('Student not found');
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
