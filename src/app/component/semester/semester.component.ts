import { Component, OnInit } from '@angular/core';
import { Semester } from 'src/app/model/semester';
import { SemesterService } from './semester.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css']
})
export class SemesterComponent implements OnInit{
  semester : Semester[] = []
  selectedSemester: string = '';
  isEditing: boolean = false;
  editingCourseId: string | null = null;


  ngOnInit(): void {
      this.getAllSemester()
  }


  semesterObj : Semester = {
    id : '',
    startDate : new Date('1900-01-01'),
    endDate : new Date('1900-01-01'),
    Year : 2020,
    semesterName : '',
    editMode: false,
  }

  id : string = '';
  semesterName : string = '';
  startDate : Date =new Date('1900-01-01');
  endDate : Date = new Date('1900');
  Year : Number = 2023;



  constructor( private sem : SemesterService){}


  addsemester() {
    if (
      this.semesterName == '' ||
      !this.startDate ||
      !this.endDate 
      
    ) {
      alert('Fill all the fields');
      return;
    }
  
    this.semesterObj.id = '';
    this.semesterObj.semesterName = this.semesterName;
    this.semesterObj.startDate = this.startDate;
    this.semesterObj.endDate = this.endDate;
    this.semesterObj.Year = this.Year;
    
  
    this.sem.addSemester(this.semesterObj);
  }
  
  toggleEdit(semester : Semester){
    semester.editMode = !semester.editMode
  }


  deletesemester (semester : Semester) {
    if (window.confirm('Are you sure to delete ' + semester.semesterName + '')){
      this.sem.deleteSemester(semester)
    }


   
  }

  getAllSemester(){
    this.sem.getSemester().subscribe(
      (res : any[]) =>{
        this.semester= res.map((e) =>{
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
      },
      (err) => {
        console.error('Error retrieving semester:', err);
        alert('Something went wrong while retrieving semest.');
      })
    
  }
  updateSemester(semester: Semester): void {
    if (!semester.semesterName.trim()) {
      alert('Please insert the values');
      return;
    }
    this.sem.updateSemester(semester).then(() => {
      console.log('Update successful');
      semester.editMode = false; // Update the editMode flag of the semester
      // Reset any editing related variables if needed
      this.editingCourseId = null;
    }).catch((error) => {
      console.error('Error updating semester:', error);
      alert('Something went wrong while updating the semester.');
    });
  }
  

}
