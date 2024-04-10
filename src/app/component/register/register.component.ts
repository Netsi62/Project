import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/shared/auth.service';
import { RegisterService } from './register.service';
import { Register } from 'src/app/model/register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userList: Register[] = [];
  // Your other properties...
  userObj: Register = {
    id :'',
    fullName : '',
    email: '',
    password:  '',
    dob : new Date('1990-01-01'),
    gender : '',
    address : '',
    phoneNumber : '',
    emergencyContact : '',
    city : '',
    StudentId : '',
    isAccepted : false,
    FileImg : 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D'
  };

    id : string ='';
    fullName :string = '';
    email: string = ''
    password: string = '';
    dob : Date =new Date('1990-01-01');
    gender : string = '';
    address : string =  '';
    phoneNumber : string =  '';
    emergencyContact : string = '';
    city : string = '';
    FileImg : string = ''
    StudentId : string ='';
    selectedImg: any;
    imgSrc : any = './assets/placeholder.png';

  constructor(private auth: AuthService, private data: RegisterService, private router : Router) {}

  adduser() {
    if (this.fullName == '') {
      alert('please enter your name');
    }
    if (this.email == '') {
      alert('please enter email');
      return;
    }

    if (this.password == '') {
      alert('please enter password');
      return;
    }
    if (this.emergencyContact == '') {
      alert('please add the emergency contact');
    }

    
    const studentId = this.generateStudentId();
    this.userObj.StudentId = studentId;

    this.userObj.email = this.email;
    this.userObj.fullName = this.fullName;
    this.userObj.password = this.password;
    this.userObj.dob = this.dob;
    this.userObj.gender = this.gender;
    this.userObj.address = this.address;
    this.userObj.phoneNumber = this.phoneNumber;
    this.userObj.emergencyContact = this.emergencyContact;
    this.userObj.city = this.city;
    this.userObj.FileImg = this.FileImg

    this.data.UploadImg(this.selectedImg, this.userObj);
    this.auth.register(this.email, this.password);
    this.imgSrc =  './assets/placeholder.png';

    this.clearInputFields();
  }

  generateStudentId(): string {
    

    const initials = this.fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();

    const randomNum = Math.floor(100 + Math.random() * 900);

   
    const studentId = initials +  randomNum;
    console.log(studentId)
    console.log(this.fullName)
    return studentId;
    
}
onChange(event: any) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.imgSrc = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
  this.selectedImg = event.target.files[0];
}


  clearInputFields() {
    this.id = '';
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.dob = new Date('1990-01-01');
    this.gender = '';
    this.address = '';
    this.phoneNumber = '';
    this.emergencyContact = '';
    this.city = '';
    this.StudentId = '';
  }

  getAllUser() {
    this.data.getAllUser().subscribe(
      (res: any[]) => {
        this.userList = res.map((e) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        console.error('error retrieving user', err);
        alert('something went wrong while retrieving users');
      }
    );
  }
  back(){
    this.router.navigate(['/userdata'])

  }
}
