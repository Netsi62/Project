import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Semester } from 'src/app/model/semester';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SemesterService implements OnInit {

  constructor(private afs:AngularFirestore) {  }


  ngOnInit(): void {
      
  }


  addSemester(semester : Semester){
    semester.id = this.afs.createId();
    return this.afs.collection('/semester').add(semester);

  }


  updateSemester(semester : Semester){
    return this.afs.doc(`semester/${semester.id}`).update(semester)
   


  }

  deleteSemester(semester : Semester){
    return this.afs.doc('/semester/' + semester.id).delete();

  }

  getSemester(){
    return this.afs.collection('/semester').snapshotChanges();

  }


  getAllSemesterNames(): Observable<string[]> {
    return this.afs.collection('semester').valueChanges()
      .pipe(
        map((semesters: any[]) => semesters.map(semester => semester.semesterName))
      );
  }

}
