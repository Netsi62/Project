import { Component, OnInit } from '@angular/core';
import { Register } from '../model/register';
import { AcceptService } from './accept.service';

@Component({
  selector: 'app-accepted',
  templateUrl: './accepted.component.html',
  styleUrls: ['./accepted.component.css']
})
export class AcceptedComponent implements OnInit {

  data : Register[] = []

  constructor(private acceptedservice : AcceptService){}
  
  ngOnInit(): void {
      this.loadData()
  }

  loadData() {
    this.acceptedservice.getData().subscribe(val =>{
      console.log(val)
       this.data =val.map((e : any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
          return data;
      })
    })
  }

}
