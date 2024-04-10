import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {
  constructor(private router : Router){}


  admin(){
    this.router.navigate(['/login'])

  }
  user(){
    this.router.navigate(['/userdata'])
  }

}
