import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userdata',
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.css']
})
export class UserdataComponent {
  constructor(private router : Router){}


  apply(){
    this.router.navigate(['/register'])

  }
  Login(){
    this.router.navigate(['/login'])
  }


}
