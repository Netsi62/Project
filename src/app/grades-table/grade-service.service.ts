import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Grade } from '../model/grade';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class GradeServiceService {

  constructor(private afs: AngularFirestore) { }

  addGrade(grade: Grade): Promise<void> {
    grade.id = this.afs.createId();
    return this.afs.collection('/grades').doc(grade.id).set(grade);
  }


  getGradesByCourseIdAndSemester(courseId: string, semester: string): Observable<Grade[]> {
    return this.afs.collection('/grades', ref => ref.where('courseId', '==', courseId).where('semester', '==', semester)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Grade;
          const id = action.payload.doc.id;
          return { ...data, id };
        });
      }),
      catchError(error => {
        console.error('Error getting grades by course ID and semester:', error);
        return throwError('Error getting grades by course ID and semester');
      })
    );
  }
  




 
  getGradesByCourseIdAndEmail(courseId: string, email: string): Observable<Grade[]> {
    return this.afs.collection('/grades', ref => ref.where('courseId', '==', courseId).where('email', '==', email)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Grade;
          const id = action.payload.doc.id;
          return { ...data, id };
        });
      }),
      catchError(error => {
        console.error('Error getting grades by course ID and email:', error);
        return throwError('Error getting grades by course ID and email');
      })
    );
    }


    getCurrentCourseIdForUser(user: User): string | null {
      // Implement your logic to fetch course ID for the user
      // For example, if course ID is stored directly in user object, it might be like:
      // return user.courseId;
      // Otherwise, fetch from another source and return.
      return null; // Return null if course ID is not found
    }
  

  getAllGrades(): Observable<Grade[]> {
    return this.afs.collection('/grades').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Grade;
          const id = action.payload.doc.id;
          return {  ...data, id };
        });
      })
    );
  }

  deleteGrade(gradeId: string): Promise<void> {
    return this.afs.collection('/grades').doc(gradeId).delete();
  }
  

 
  getGradeById(gradeId: string): Observable<Grade | undefined> {
    return this.afs.doc<any>('/grades/' + gradeId).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data();
        const id = action.payload.id;
        return { id, ...data } as Grade; // Cast data to Grade type
      }),
      catchError(error => {
        console.error('Error getting grade by ID:', error);
        return throwError('Error getting grade by ID');
      })
    );
  }

  getGradesByCourseId(courseId: string): Observable<Grade[]> {
    return this.afs.collection('/grades', ref => ref.where('courseId', '==', courseId)).snapshotChanges().pipe(
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

  getGradesByEmail(email: string): Observable<Grade[]> {
    return this.afs.collection('/grades', ref => ref.where('email', '==', email)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Grade;
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
}
