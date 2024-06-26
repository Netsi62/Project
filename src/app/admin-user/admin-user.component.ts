import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/shared/auth.service';
import { AdminUserService } from './admin-user.service';
import { Admin } from '../model/admin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent {
  userList: Admin[] = [];
  editedAdmin: Admin | null = null;
  // Your other properties...
  userObj: Admin = {
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
    editMode : false,
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
    StudentId : string ='';

  constructor(private auth: AuthService, private data: AdminUserService) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.data.getAllUser().subscribe(
      (res: any[]) => {
        this.userList = res.map((e) => {
          const data = e.payload.doc.data() as Admin;
          data.id = e.payload.doc.id;
          data.editMode = false; 
          return data;
        });
      },
      (err) => {
        console.error('Error retrieving users:', err);
        alert('Something went wrong while retrieving users.');
      }
    );
  }

 
  deleteAdmin(admin: Admin) {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.data.deleteAdmin(admin).then(() => {
        // Remove the admin from the userList array
        this.userList = this.userList.filter(a => a.id !== admin.id);
        Swal.fire('Admin Deleted Successfuly');
      }).catch(error => {
        console.error('Error deleting admin:', error);
        alert('Failed to delete admin.');
      });
    }
  }





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

    
   

    // Generate a unique student ID
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

    this.data.adduser(this.userObj);
    this.auth.register(this.email, this.password);

    // Clear input fields after adding user
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


  editAdmin(admin: Admin) {
    // Set edit mode for the selected admin only
    admin.editMode = true;
  }

  saveAdmin(admin: Admin) {
    this.data.updateAdmin(admin).then(() => {
      Swal.fire('Admin Edited Successfuly');
      admin.editMode = false; // Disable edit mode after saving
    }).catch(error => {
      console.error('Error updating admin:', error);
      alert('Failed to update admin.');
    });
  }

  cancelEdit(admin: Admin) {
    admin.editMode = false; // Cancel edit mode for the admin
  }


}





//



