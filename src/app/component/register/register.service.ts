import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Register } from 'src/app/model/register';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService 
  ) { }

  adduser(user : Register){
    user.id = this.afs.createId();
    return this.afs.collection('/RegisteredUser').add(user);
  }

  getAllUser(){
    return this.afs.collection('/RegisteredUser').snapshotChanges();
  }

  deleteuser(user : Register){
    return this.afs.doc('/RegisteredUser/' + user.id).delete();
  }

  getUserByEmail(email: string): Observable<Register | undefined> {
    return this.afs.collection('RegisteredUser', ref => ref.where('email', '==', email)).snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length > 0) {
            const data = actions[0].payload.doc.data() as Register;
            const id = actions[0].payload.doc.id;
            return {  ...data, id };
          } else {
            return undefined;
          }
        })
      );
  }
  

  getUserDetailsOfLoggedInUser(): Observable<Register | undefined> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user && user.email) {
          return this.getUserByEmail(user.email);
        } else {
          return of(undefined);
        }
      })
    );
  }
}
