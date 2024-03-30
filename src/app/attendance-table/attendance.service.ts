import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Attendance } from '../model/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private attendanceCollection: AngularFirestoreCollection<Attendance>;

  constructor(private afs: AngularFirestore) {
    this.attendanceCollection = this.afs.collection<Attendance>('attendance');
  }

  getAllAttendance(): Observable<Attendance[]> {
    return this.attendanceCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Attendance;
          const id = action.payload.doc.id;
          return { ...data, id };
        });
      }),
      catchError(error => {
        console.error('Error fetching all attendance:', error);
        return throwError('Error fetching all attendance');
      })
    );
  }

  

  getAttendanceByCourseIdAndEmail(courseId: string, email: string): Observable<Attendance[]> {
    return this.afs.collection('/attendance', ref => ref.where('courseId', '==', courseId).where('email', '==', email)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Attendance;
          const id = action.payload.doc.id;
          return { ...data, id };
        });
      }),
      catchError(error => {
        console.error('Error getting attendance by course ID and email:', error);
        return throwError('Error getting attendance by course ID and email');
      })
    );
  }

  addAttendance(attendance: Attendance): Promise<any> {
    return this.attendanceCollection.add(attendance);
  }

  getAttendanceByEmail(email: string): Observable<Attendance[]> {
    return this.afs.collection<Attendance>('attendance', ref => ref.where('userId', '==', email))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Attendance;
          const id = a.payload.doc.id;
          return { id, ...data };
        })),
        catchError(error => {
          console.error('Error fetching attendance:', error);
          return throwError('Error fetching attendance');
        })
      );
  }
}
