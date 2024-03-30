import { Injectable } from '@angular/core';
import { Courses } from 'src/app/model/courses';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Grade } from 'src/app/model/grade';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  coursesList: Courses[] = [];

  constructor(private auth: AuthService, private data: DataService, private firestore: AngularFirestore) { }

  getAllCourses(): Observable<Courses[]> {
    return this.data.getAllCourses().pipe(
      map((res: any[]) => {
        return res.map((e) => {
          const data = e.payload.doc.data() as Courses; // Cast to Courses
          data.id = e.payload.doc.id;
          return data;
        });
      }),
      catchError((err) => {
        console.error('Error retrieving courses:', err);
        alert('Something went wrong while retrieving courses.');
        return throwError(err); 
      })
    );
  }
  
  getCoursesForStudent(email: string): Observable<Courses[]> {
    return this.firestore.collection<Courses>('courses', ref => ref.where('studentEmail', '==', email)).valueChanges();
  }

  getGradesByCourseId(courseId: string): Observable<Grade[]> {
    return this.firestore.collection('/grades', ref => ref.where('courseId', '==', courseId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Grade;
          const id = action.payload.doc.id;
          return {  ...data, id };
        });
      }),
      catchError(error => {
        console.error('Error getting grades by course ID:', error);
        return throwError('Error getting grades by course ID');
      })
    );
  }

  addCourse(course: Courses) {
    this.data.addCourse(course);
  }

  deleteCourses(course: Courses) {
    this.data.deleteCourses(course);
  }

  getCourseById(courseId: string): Observable<Courses> {
    return this.firestore.collection<Courses>('studentcourse').doc(courseId).valueChanges().pipe(
      map(course => {
        if (!course) {
          throw new Error(`Course with ID ${courseId} not found`);
        }
        return course as Courses;
      })
    );
  }
  getCourseNameById(courseId: string): Observable<string> {
    return this.firestore.collection<Courses>('studentcourse').doc(courseId).valueChanges().pipe(
      map(course => {
        if (!course) {
          throw new Error(`Course with ID ${courseId} not found`);
        }
        return course.course_name; 
      })
    );
  }
}
