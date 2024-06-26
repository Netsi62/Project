import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router, private firestore: AngularFirestore) {}

  ngOnInit(): void {}

  async login() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    try {
      await this.auth.login(this.email, this.password);
      // Note: No need for separate navigation here, AuthService handles navigation
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error as needed, e.g., display error message to the user
    }
  }
}