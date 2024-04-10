import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private afs : AngularFirestore) { }

  getAllUser(){
    return this.afs.collection('RegisteredUser').snapshotChanges();
  }

  markedAccepted(id : any, AcceptedData : any){
    return this.afs.doc(`RegisteredUser/${id}`).update(AcceptedData).then(()=> {
      console.log('student status changed')
    })
  }
}
