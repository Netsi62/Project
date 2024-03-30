import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {Students} from '../model/student';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private studentsCollection: AngularFirestoreCollection<Students>;

  constructor(private afs: AngularFirestore) {
    this.studentsCollection = this.afs.collection<Students>('students');
  }


addStudent(student: Students){
    student.id = this.afs.createId();
    return this.afs.collection('/studentcourse').doc(student.id).set(student);
  }
  getAllStudents(): Observable<Students[]> {
    return this.afs.collection('/studentcourse').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Students;
          const id = action.payload.doc.id;
          return Object.assign({}, { id }, data);

        });
      })
    );
  }

  getUserRegistrationByEmail(email: string): Observable<Students[]> {
    return this.afs.collection('/studentcourse', ref => ref.where('email', '==', email)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Students;
          const id = action.payload.doc.id;
          return {  ...data, id };
        });
      }),
      catchError(error => {
        console.error('Error getting grades by email:', error);
        return throwError('Error getting grades by email');
      })
    );
  }

  getStudentsByCourseId(courseId: string): Observable<Students[]> {
    return this.afs.collection<Students>('/studentcourse', ref => ref.where('courseId', '==', courseId)).valueChanges();
  }
  
  deleteStudent(id: string): Promise<void> {
    if (!id) {
      console.error('Invalid student id:', id);
      return Promise.reject('Invalid student id.');
    }
  
    return this.afs.collection('/studentcourse').doc(id).delete();
  }

  getStudentByEmail(email: string): Observable<Students[]> {
    return this.studentsCollection.valueChanges({ idField: 'id' }).pipe(
      map(students => students.filter(student => student.email === email))
    );
  }


  getEmailAndDepartmentByCourseId(courseId: string): Observable<{ email: string, department: string }> {
    return this.afs.collection<Students>('students', ref => ref.where('courseId', '==', courseId)).valueChanges().pipe(
      switchMap((students: Students[]) => {
        if (students.length > 0) {
          const student = students[0]; // Assuming there's only one student per course
          // Assuming student has a userId property
          return this.afs.collection('users').doc(student.id).valueChanges().pipe(
            map((userData: any) => {
              return {
                email: userData.email,
                department: userData.department
              };
            }),
            catchError(error => {
              throw new Error('Error fetching user data: ' + error.message);
            })
          );
        } else {
          // Return default values if no students are found for the given course ID
          return of({ email: 'Default Email', department: 'Default Department' });
        }
      }),
      catchError(error => {
        throw new Error('Error fetching students: ' + error.message);
      })
    );
  }
  
}

