import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import {Courses} from '../model/courses'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs : AngularFirestore) { }


addCourse(course : Courses){
    course.id =this.afs.createId();
    return this.afs.collection('/courses').add(course)

  }

getAllCourses(){
    return this.afs.collection('/courses').snapshotChanges();
  }

deleteCourses(course : Courses){
    return this.afs.doc('/courses/'+ course.id).delete();

  }

  updateCourse(course: Courses): Promise<void> {
    return this.afs.doc(`courses/${course.id}`).update(course);
  }

}