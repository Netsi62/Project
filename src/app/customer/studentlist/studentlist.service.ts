import { Injectable } from '@angular/core';
import { Courses } from 'src/app/model/courses';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class StudentlistService {

    coursesList: Courses[] = [];
  
    constructor(private auth: AuthService, private data: DataService, private firestore: AngularFirestore) { }
  
    getAllCourses(): Observable<Courses[]> {
      return this.data.getAllCourses().pipe(
        map((res: any[]) => {
          return res.map((e) => {
            const data = e.payload.doc.data();
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
