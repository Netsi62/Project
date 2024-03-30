import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Courses } from '../model/courses';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private firestore: AngularFirestore) {}

  getCoursesByGrade(grade: number): Observable<Courses[]> {
    return this.firestore
      .collection<Courses>('courses', ref => ref.where('grade', '==', grade))
      .valueChanges();
  }

  getCourseById(id: string): Observable<Courses> {
    return this.firestore
      .doc<Courses>(`courses/${id}`)
      .valueChanges()
      .pipe(
        map(course => {
          if (!course) {
            throw new Error(`Course with ID ${id} not found`);
          }
          return course;
        })
      );
  }
}
