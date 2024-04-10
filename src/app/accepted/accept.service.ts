import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AcceptService {

  constructor(private afs : AngularFirestore) { }


  getData (){
    return this.afs.collection('RegisteredUser', ref => ref.where('isAccepted' , '==', true)).snapshotChanges()
  }
}
