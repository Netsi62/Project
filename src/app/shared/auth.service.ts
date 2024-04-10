import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../model/User'
import { map } from 'rxjs';
import { Register } from '../model/register';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  RegisterObj :  Register  =  {
    id : '',
    fullName : '',
    dob :new Date('1990-01-01'),
    gender : '',
    address : '',
    phoneNumber : '',
    email : '',
    emergencyContact : '',
    city : '',
    password : '',
    StudentId : '',
    isAccepted : false,
  
  }
  id: string = '';
  fullName: string = '';
  dob: Date = new Date('1990-01-01');
  gender: string = '';
  address: string = '';
  phoneNumber: string = '';
  email: string = '';
  emergencyContact: string = '';
  city:string = '';
  password : string = '';
  StudentId : string = '';
  

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) {}

  getUserRegistrationByEmail(email: string): Observable<Register> {
    return this.angularFirestore.collection('/RegisteredUser').doc(email).valueChanges() as Observable<Register>;
  }



  getCurrentUser(): Observable<User | null> {
    return this.angularFireAuth.authState.pipe(
      map(authState => {
        if (authState) {
        
          return {
            uid: authState.uid,
            email: authState.email,
          } as User;
        } else {
          return null;
        }
      })
    );
  }

   

  


  async login(email: string, password: string): Promise<void> {
    try {
      // Check if the user is an admin
      const adminSnapshot = await this.angularFirestore.collection('AdminUser', ref => ref.where('email', '==', email)).get().toPromise();
      if (adminSnapshot && !adminSnapshot.empty) {
        this.router.navigate(['dashboard']);
        return; // Exit function early if the user is an admin
      }
  
      // Check if the user is registered and accepted
      const userSnapshot = await this.angularFirestore.collection('RegisteredUser', ref => ref.where('email', '==', email)).get().toPromise();
      if (userSnapshot && !userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data() as Register;
        if (userData.isAccepted) {
          // User is accepted, proceed with login
          await this.angularFireAuth.signInWithEmailAndPassword(email, password);
          this.router.navigate(['/user/studentCourse']);
        } else {
          // User is not yet accepted
          alert(`${userData.email} is not yet accepted. Please wait for approval`)
          console.log('User is not yet accepted. Please wait for approval.');
          // You can display a message to the user indicating that they are not yet accepted
        }
      } else {
        // User not found in registered users
        console.log('User not found or not registered.');
        // You can display a message to the user indicating that their email is not registered
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
  


  register(email: string, password: string): void {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
      const user = userCredential.user!;
      
      this.storeRegisteredEmail(user.uid, email);
      alert(' Successful Add ' ); 
      this.router.navigate(['/login']);
    }).catch(err => {
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }
  

  logout(): void {
    this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }).catch(err => {
      alert(err.message);
    });
  }

  
  
  private storeRegisteredEmail(userId: string, email: string): void {
    this.angularFirestore.collection('registered_emails').doc(userId).set({ email: email })
      .then(() => {
        console.log('Registered email stored successfully');
      }).catch(error => {
        console.error('Error storing registered email: ', error);
      });
  }
}