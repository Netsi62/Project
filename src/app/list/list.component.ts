import { Component, OnInit } from '@angular/core';
import { ListService } from './list.service';
import { Register } from '../model/register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  userList : Register [] = []



  constructor(private data : ListService, private router : Router){}

  ngOnInit(): void {
      this.getAllUser()
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
  onChanged(id : any, value : any) {
    const changedData = {
      isAccepted : value
    }
    this.data.markedAccepted(id , changedData);
  }

  accept(){
    this.router.navigate(['/accepted'])
  }



}
