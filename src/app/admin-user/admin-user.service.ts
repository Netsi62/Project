import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Admin } from '../model/admin';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  authService: AuthService; 
  afs: AngularFirestore; 

  constructor(private authServiceInstance: AuthService, private afsInstance: AngularFirestore) {
    this.authService = authServiceInstance; 
    this.afs = afsInstance; 
  }

  adduser(user : Admin){
    user.id = this.afs.createId();
    return this.afs.collection('/AdminUser').add(user);
  }
 

  getAllUser(){
    return this.afs.collection('/AdminUser').snapshotChanges();
  }
  deleteuser(user : Admin){
    return this.afs.doc('/AdminUser/' + user.id).delete();
  }

  updateAdmin(admin: Admin) {
    return this.afs.doc(`/AdminUser/${admin.id}`).update(admin);
  }


  getUserByEmail(email: string): Observable<Admin | undefined> {
    return this.afs.collection('RegisteredUser', ref => ref.where('email', '==', email)).snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length > 0) {
            const data = actions[0].payload.doc.data() as Admin;
            const id = actions[0].payload.doc.id;
            return {  ...data, id };
          } else {
            return undefined;
          }
        })
      );
  }
  

  getUserDetailsOfLoggedInUser(): Observable<Admin | undefined> {
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
  deleteAdmin(admin: Admin) {
    return this.afs.doc('/AdminUser/' + admin.id).delete();
  }









}
